// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // price at order time
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "paid" },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      notes: { type: String },
    },
    paymentMethod: { type: String },
    paymentAccount: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentAccount" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
