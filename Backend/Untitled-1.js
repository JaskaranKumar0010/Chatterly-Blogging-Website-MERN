// Update profile photo
authRouter.put("/profilephoto/:id", profile.single("profilephoto"), async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profile photo
    user.profilephoto = req.file.path;

    await user.save();

    res.status(200).json({ message: "Profile photo updated", user });
  } catch (err) {
    console.error("Error updating profile photo", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


  //
authRouter.put("/profiledata/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phonenumber, address } = req.body;
    const prodata = await User.findById(id);
    if (!prodata) {
      return res.status(404).json({ message: "User not found" });
    }
    prodata.name = name;
    prodata.email = email;
    prodata.phonenumber = phonenumber;
    prodata.address = address;
    await prodata.save();
    res.json(prodata);
  } catch (err) {
    console.error("Error in fetching profile update", err);
    res.status(500).json({ message: "Internal server error" });
    }
  });