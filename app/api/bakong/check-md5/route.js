// app/api/bakong/check-md5/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { md5 } = await req.json();
    if (!md5) {
      return NextResponse.json({ success: false, message: "MD5 required" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.BAKONG_API_URL}/v1/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BAKONG_CLIENT_SECRET,
        },
        body: JSON.stringify({ md5 }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Bakong error:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Bakong API error", detail: text },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      success: data.responseCode === 0,
      message: data.responseMessage,
      data: data.data ?? null,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
