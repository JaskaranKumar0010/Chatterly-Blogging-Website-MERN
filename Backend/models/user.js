import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  profilephoto: { type: String },
  address: { type: String },
});

export const User = mongoose.model("User", UserSchema);
