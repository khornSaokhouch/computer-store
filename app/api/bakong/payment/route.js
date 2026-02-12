import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import PaymentAccount from "../../../models/PaymentAccount";
import { NextResponse } from "next/server";
import crypto from "crypto";
import BakongKHQR from "../../../../lib/BakongKHQR";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, amount: rawAmount, paymentAccountId: rawAccountId } = body;

    let amount = 0;
    let targetAccountId = null;

    // 1️⃣ Determine amount & account
    if (orderId) {
      const order = await Order.findById(orderId).lean();
      if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
      }

      amount = order.total || order.totalPrice;
      targetAccountId = order.paymentAccountId || order.paymentAccount;
    } else {
      amount = rawAmount;
      targetAccountId = rawAccountId;
    }

    if (!amount) {
      return NextResponse.json({ success: false, message: "Amount missing" }, { status: 400 });
    }
    if (!targetAccountId) {
      return NextResponse.json({ success: false, message: "Payment account missing" }, { status: 400 });
    }

    // 2️⃣ Load payment account
    const account = await PaymentAccount.findById(targetAccountId).lean();
    if (!account) {
      return NextResponse.json({ success: false, message: "Payment account not found" }, { status: 404 });
    }

    // 3️⃣ Generate STATIC Bakong QR
    const qrPayload = BakongKHQR.generateIndividualStatic({
      bakongAccountID: account.accountId,
      merchantName: account.userName,
      merchantCity: account.city,
      amount: parseFloat(amount),
      currency: (account.currency || "KHR").toUpperCase(),
      billNumber: orderId ? orderId.toString() : `TEMP-${Date.now()}`,
    });

    // 4️⃣ Generate MD5
    const md5 = crypto.createHash("md5").update(qrPayload).digest("hex");

    // 5️⃣ QR image
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}`;

    // 6️⃣ Save to order
    if (orderId) {
      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            paymentMethod: "Bakong",
            paymentStatus: "pending",
            md5,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      qrCode: qrUrl,
      paymentUrl: `bakong://pay?data=${qrPayload}`,
      md5,
    });

  } catch (err) {
    console.error("Bakong QR Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
