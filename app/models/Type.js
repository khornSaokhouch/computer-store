import mongoose from "mongoose";

// ==================== Type Schema ====================
const typeSchema = new mongoose.Schema(
  {
    type_name: {
      type: String,
      required: true,
      trim: true, // removes whitespace around the name
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // references the Category collection
      required: true,  // each type must belong to a category
    },
    description: {
      type: String,
      default: "", // optional description
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent model overwrite during hot reload in Next.js
const Type = mongoose.models.Type || mongoose.model("Type", typeSchema);

export default Type;
