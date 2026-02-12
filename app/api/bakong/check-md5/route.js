import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const { md5 } = await req.json();

    if (!md5) {
      return NextResponse.json(
        { success: false, message: "MD5 required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find order by MD5
    const order = await Order.findOne({ md5 });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    // 2️⃣ Simulate pending payment logic
    if (order.paymentStatus === "pending") {
      const shouldPay = Math.random() > 0.7; // 30% chance to mark paid per poll

      if (!shouldPay) {
        return NextResponse.json({
          success: false,
          message: "Waiting for payment",
          data: { orderId: order._id, status: "pending" },
        });
      }

      // Mark order as paid
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      await order.save();
    }

    // 3️⃣ Return success
    return NextResponse.json({
      success: true,
      message: "Payment success",
      data: {
        orderId: order._id,
        amount: order.total || order.totalPrice,
        status: order.paymentStatus,
      },
    });
  } catch (err) {
    console.error("Check MD5 Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
