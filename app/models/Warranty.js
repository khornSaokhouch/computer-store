import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    warranty_name: { type: String, required: true }, 
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "void"], default: "active" },
  },
  { timestamps: true }
);

const Warranty = mongoose.models.Warranty || mongoose.model("Warranty", warrantySchema);
export default Warranty;
