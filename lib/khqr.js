// /**
//  * BakongKHQR - Generate KHQR (Bakong QR) strings
//  * Supports static individual QR for Bakong accounts
//  */
// class BakongKHQR {
//   /**
//    * Generate a static individual KHQR
//    * Matches the real Bakong format (static QR, no amount)
//    *
//    * @param {Object} info
//    * @param {string} info.bakongAccountID - Bakong account ID
//    * @param {string} info.merchantName - Merchant / User Name
//    * @param {string} info.merchantCity - City
//    * @returns {string} EMV-compliant KHQR string
//    */
//   static generateIndividualStatic({ bakongAccountID, merchantName, merchantCity, amount, currency, billNumber }) {
//     const data = [];
//     const currencyCode = currency === 'USD' ? '840' : '116';

//     // 00 – Payload Format Indicator
//     data.push(this.tag("00", "01"));

//     // 01 – Point of Initiation Method (12 = dynamic if amount present or unique ref)
//     data.push(this.tag("01", (amount || billNumber) ? "12" : "11"));

//     // 29 – Merchant Account Information (Bakong)
//     // Sub-tag 00: Account ID
//     const merchantAccountInfo = this.tag("00", bakongAccountID);
//     data.push(this.tag("29", merchantAccountInfo));

//     // 52 – Merchant Category Code (General)
//     data.push(this.tag("52", "5999"));

//     // 53 – Currency Code
//     data.push(this.tag("53", currencyCode));

//     // 54 - Amount
//     if (amount) {
//         data.push(this.tag("54", parseFloat(amount).toFixed(2)));
//     }

//     // 58 – Country Code
//     data.push(this.tag("58", "KH"));

//     // 59 – Merchant / User Name
//     data.push(this.tag("59", merchantName));

//     // 60 – Merchant City
//     data.push(this.tag("60", merchantCity));

//     // 62 - Additional Data Field (Bill Number)
//     if (billNumber) {
//         // Sub-tag 01: Bill Number
//         const additionalData = this.tag("01", billNumber);
//         data.push(this.tag("62", additionalData));
//     }

//     // Append CRC placeholder (tag 63 length 04)
//     const payload = data.join("") + "6304";

//     // Calculate CRC-16/CCITT-FALSE
//     const crc = this.crc16(payload);

//     return payload + crc;
//   }

//   /**
//    * Helper to format EMV tags
//    */
//   static tag(id, value) {
//     if (value === undefined || value === null) return "";
//     const str = String(value);
//     const len = str.length.toString().padStart(2, "0");
//     return `${id}${len}${str}`;
//   }

//   /**
//    * CRC-16/CCITT-FALSE calculation
//    */
//   static crc16(str) {
//     let crc = 0xffff;

//     for (let i = 0; i < str.length; i++) {
//       crc ^= str.charCodeAt(i) << 8;

//       for (let j = 0; j < 8; j++) {
//         if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
//         else crc <<= 1;

//         crc &= 0xffff;
//       }
//     }

//     return crc.toString(16).toUpperCase().padStart(4, "0");
//   }
//   /**
//    * Helper for API requests
//    */
//   static async _post(endpoint, body, config) {
//     if (!config.apiUrl || !config.token) {
//         throw new Error("Missing Bakong API configuration");
//     }
//     const url = `${config.apiUrl}/v1/${endpoint}`;
//     const res = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${config.token}`
//         },
//         body: JSON.stringify(body)
//     });
//     return await res.json();
//   }

//   /**
//    * Check transaction status by MD5 (Alias for compatibility)
//    */
//   static async checkTransaction(md5, config) {
//       return this.checkTransactionByMD5(md5, config);
//   }

//   static async checkTransactionByMD5(md5, config) {
//     return this._post("check_transaction_by_md5", { md5 }, config);
//   }

//   static async checkTransactionByMD5List(md5List, config) {
//     return this._post("check_transaction_by_md5_list", { md5: md5List }, config);
//   }

//   static async checkTransactionByFullHash(hash, config) {
//     return this._post("check_transaction_by_hash", { hash }, config);
//   }

//   static async checkTransactionByFullHashList(hashList, config) {
//     return this._post("check_transaction_by_hash_list", { hash: hashList }, config);
//   }

//   static async checkTransactionByShortHash(hash, amount, currency, config) {
//      return this._post("check_transaction_by_short_hash", { hash, amount, currency }, config);
//   }

//   static async checkTransactionByInstructionReference(instructionRef, config) {
//       return this._post("check_transaction_by_instruction_ref", { instructionRef }, config);
//   }

//   static async checkTransactionByExternalReference(externalRef, config) {
//       return this._post("check_transaction_by_external_ref", { externalRef }, config);
//   }

//   static async checkBakongAccount(accountId, config) {
//       return this._post("check_bakong_account", { accountId }, config);
//   }
// }

// export default BakongKHQR;
