// utils/bakong.js
import crypto from "crypto";

export const createMd5Signature = (params, clientSecret) => {
  const sortedKeys = Object.keys(params).sort();
  const str =
    sortedKeys.map((k) => `${k}=${params[k]}`).join("&") +
    `&key=${clientSecret}`;
  return crypto.createHash("md5").update(str).digest("hex").toUpperCase();
};

export const generateBakongQR = ({
  bakongAccountID,
  merchantName,
  merchantCity,
  currency = "KHR",
  amount,
  billNumber
}) => {
  const clientId = process.env.BAKONG_CLIENT_ID;
  const clientSecret = process.env.BAKONG_CLIENT_SECRET;

  const payload = {
    clientId,
    bakongAccountID,
    merchantName,
    merchantCity,
    currency,
    amount,
    billNumber,
    timestamp: Date.now()
  };

  payload.signature = createMd5Signature(payload, clientSecret);

  // KHQR simplified string
  return `000201010211${payload.clientId}${payload.bakongAccountID}${payload.merchantName}${payload.merchantCity}${payload.amount}${payload.currency}${payload.billNumber}${payload.timestamp}${payload.signature}`;
};
