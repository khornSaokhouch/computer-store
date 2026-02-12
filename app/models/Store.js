import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },            // Optional address/location
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store owner
    image: { type: String, default: "" },              // Store image URL or path
    contact_email: { type: String, default: "" },
    contact_phone: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
export default Store;
