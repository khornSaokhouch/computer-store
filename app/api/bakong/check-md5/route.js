// /app/api/bakong/check-md5/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BAKONG_API_URL = process.env.BAKONG_API_URL;
const BAKONG_CLIENT_SECRET = process.env.BAKONG_CLIENT_SECRET;

export async function POST(req) {
  try {
    // ✅ Validate env vars first
    if (!BAKONG_API_URL || !BAKONG_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Bakong env vars not configured" },
        { status: 500 }
      );
    }

    const { md5 } = await req.json();

    if (!md5) {
      return NextResponse.json(
        { success: false, message: "MD5 required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BAKONG_API_URL}/v1/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BAKONG_CLIENT_SECRET}`,
        },
        body: JSON.stringify({ md5 }),
      }
    );

    // ✅ IMPORTANT: handle non-JSON / error responses
    if (!response.ok) {
      const text = await response.text();
      console.error("Bakong API error:", response.status, text);

      return NextResponse.json(
        {
          success: false,
          message: "Bakong API error",
          detail: text,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.responseCode === 0) {
      return NextResponse.json({
        success: true,
        message: "payment success",
        data: data.data,
      });
    }

    return NextResponse.json({
      success: false,
      message: data.responseMessage || "payment not found",
      data: null,
    });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
