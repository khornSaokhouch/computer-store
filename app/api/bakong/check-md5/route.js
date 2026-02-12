// /app/api/bakong/check-md5/route.js
import { NextResponse } from "next/server";

const BAKONG_API_URL = process.env.BAKONG_API_URL;
const BAKONG_CLIENT_SECRET = process.env.BAKONG_CLIENT_SECRET;

export async function POST(req) {
  try {
    const { md5 } = await req.json();

    if (!md5) 
      return NextResponse.json({ success: false, message: "MD5 required" }, { status: 400 });

    // Call Bakong API
    const response = await fetch(`${BAKONG_API_URL}/v1/check_transaction_by_md5`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BAKONG_CLIENT_SECRET}`
      },
      body: JSON.stringify({ md5 }) // Must be the full 32-char MD5 from qrPayload
    });

    const data = await response.json();

    // Translate response for frontend
    // Bakong returns responseCode 0 for success. Data object contains transaction details.
    if (data.responseCode === 0) {
      return NextResponse.json({ success: true, message: "payment success", data: data.data });
    } else {
      return NextResponse.json({ success: false, message: data.responseMessage || "error", data: null });
    }

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Server Error", data: null }, { status: 500 });
  }
}
