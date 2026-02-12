import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["user","admin","owner"], default: "user" },
}, { timestamps: true });

// Prevent hot-reload errors in Next.js
export default mongoose.models.User || mongoose.model("User", UserSchema);
