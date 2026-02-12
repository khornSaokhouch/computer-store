import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // References to other collections
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },

  // NEW: store reference
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

  // NEW: Payment Account reference (Specific bank account for this product's revenue)
  paymentAccount: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentAccount" },

  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  warranty: { type: mongoose.Schema.Types.ObjectId, ref: "Warranty" },
  description: String,
  images: [String],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
