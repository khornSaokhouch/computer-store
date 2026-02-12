import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },    
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: "" // Optional image URL or path
    }
  },
  {
    timestamps: true
  }
);

// ✅ Prevent OverwriteModelError
const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;
