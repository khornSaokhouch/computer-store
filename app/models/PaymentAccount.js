// models/PaymentAccount.js
import mongoose from "mongoose";

const paymentAccountSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Bakong"],
      required: true,
    },
    city: {
      type: String,
      required: true, // you can make it optional by setting required: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentAccount || mongoose.model("PaymentAccount", paymentAccountSchema);
