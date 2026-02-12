import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import PaymentAccount from "../../../models/PaymentAccount"; // Your model
import { NextResponse } from "next/server";
import crypto from "crypto";
import BakongKHQR from "../../../../lib/BakongKHQR";



export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, amount: rawAmount, paymentAccountId: rawAccountId } = body;

    let amount = 0;
    let targetAccountId = null;

    // 1. Determine Source (Order or Raw)
    if (orderId) {
      const order = await Order.findById(orderId).lean();
      if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
      
      amount = order.total || order.totalPrice;
      targetAccountId = order.paymentAccountId || order.paymentAccount;
    } else {
      amount = rawAmount;
      targetAccountId = rawAccountId;
    }

    if (!amount) 
      return NextResponse.json({ success: false, message: "Amount missing" }, { status: 400 });
    if (!targetAccountId)
      return NextResponse.json({ success: false, message: "Payment account missing" }, { status: 400 });

    // 2. Find the selected Payment Account from DB
    const account = await PaymentAccount.findById(targetAccountId).lean();
    if (!account) {
       return NextResponse.json({ success: false, message: "Linked payment account not found" }, { status: 404 });
    }

    // 3. Setup Payload from Account
    const accountId = account.accountId;
    const merchantName = account.userName;
    const merchantCity = account.city;
    const currency = account.currency || "KHR"; 

    // 4. Generate the QR Payload
    const qrPayload = BakongKHQR.generateIndividualStatic({
      bakongAccountID: accountId,
      merchantName: merchantName,
      merchantCity: merchantCity,
      amount: parseFloat(amount), 
      currency: currency.toUpperCase(),
      billNumber: orderId ? orderId.toString() : ("TEMP" + Date.now())
    });

    // 5. Generate MD5 from the Payload
    const md5 = crypto.createHash("md5").update(qrPayload).digest("hex");

    // 6. Generate QR Image URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}`;

    // 7. Save MD5 back to the Order (ONLY IF orderId exists)
    if (orderId) {
      await Order.updateOne(
        { _id: orderId },
        { 
          $set: {
            paymentMethod: "Bakong",
            paymentStatus: "pending",
            md5: md5 
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      qrCode: qrUrl,
      paymentUrl: `bakong://pay?data=${qrPayload}`, 
      md5
    });

  } catch (err) {
    console.error("Bakong QR Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}