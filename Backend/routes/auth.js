import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";

const authRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilepics/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const profilepics = multer({ storage: storage });

//  SignUp API
authRouter.post("/signup", async (req, res) => {
  try {
    const { userName, email, phonenumber, password, confirmPassword } =
      req.body;
    const profilephoto = "profilepics/default_profile_pic/default_pfp.jpg";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(204).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(201).json({ message: "Passwords do not match" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      userName,
      email,
      phonenumber,
      password: hashPassword,
      profilephoto,
    });
    await user.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LogIn API
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existinguser = await User.findOne({ email });
    if (!existinguser) {
      return res.status(204).json({ message: "User doesn't exist" });
    }
    const matchPassword = await bcrypt.compare(password, existinguser.password);
    if (!matchPassword) {
      return res.status(201).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userID: existinguser._id },
      process.env.JWT_SECRET_KEY
    );
    return res
      .status(200)
      .json({ message: "Login successful", token, existinguser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get User Data from User ID
authRouter.get("/profiledata/:id", async (req, res) => {
  const userID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User details received successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error getting user details", error });
  }
});

// Send Forgot Password Mail
authRouter.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(201).json({ message: "Email not registered" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const link = `http://localhost:3000/resetpassword/${email}
    Regards: Chatterly Blogs Team`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset link is: ${link}. Please click on this link to reset your password.`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return res
      .status(200)
      .json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to send password reset email" });
  }
});

//Update Profile Photo
authRouter.put("/updateprofilephoto/:id", profilepics.single("profilephoto"),async (req, res) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profilephoto !== "profilepics/default_profile_pic/default_pfp.jpg") {
        const filePath = user.profilephoto;
        try {
          // Check if file exists before unlinking
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Error deleting image file:", err);
        }
      }

      user.profilephoto = req.file.path.replace(/\\/g, "/");

      await user.save();

      res.status(200).json({ message: "Profile photo updated", user });
    } catch (err) {
      console.error("Error updating profile photo", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Update Profile Data
authRouter.put("/updateprofiledata/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, email, phonenumber, address } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.userName = userName;
    user.email = email;
    user.phonenumber = phonenumber;
    user.address = address;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error in profile update", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change Password
authRouter.post("/changepassword", async (req, res) => {
  try {
    const { userId, currentpassword, newpassword, confirmnewpassword } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(
      currentpassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(201).json({ message: "Current password is incorrect" });
    }

    // Check if the new password and confirm new password match
    if (newpassword !== confirmnewpassword) {
      return res.status(202).json({ message: "New passwords do not match" });
    }

    if (newpassword == currentpassword) {
      return res
        .status(203)
        .json({ message: `New password can't be same as current password` });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newpassword, saltRounds);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
authRouter.post("/resetpassword/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { newpassword, confirmnewpassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new password and confirm new password match
    if (newpassword !== confirmnewpassword) {
      return res.status(201).json({ message: "New passwords do not match" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newpassword, saltRounds);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET endpoint to fetch data for multiple users using query parameters
authRouter.get('/fetchCommentOwnersData', async (req, res) => {
  const userIds = req.query.userIds.split(','); // Expect a comma-separated string of user IDs
  try {
      // Find users by their IDs
      const users = await User.find({ _id: { $in: userIds } }).select('_id userName profilephoto');
      res.status(200).json({success: true,data: users});
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({success: false,message: 'Server Error'});
  }
});

export default authRouter;
