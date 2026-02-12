import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;
