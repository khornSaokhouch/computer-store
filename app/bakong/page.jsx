// 'use client'; 

// import { useState, useEffect } from 'react';

// export default function BakongPayment() {
//   // Ensure this points to your Laravel server, e.g., http://localhost:8000
//   const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'; 

//   const [products, setProducts] = useState([]);
//   const [productId, setProductId] = useState('');
//   const [currency, setCurrency] = useState('KHR');
//   const [qrData, setQrData] = useState(null);
//   const [amount, setAmount] = useState(null);
//   const [merchantRef, setMerchantRef] = useState(null);
//   const [md5, setMd5] = useState('');
//   const [checkResult, setCheckResult] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch products
//   useEffect(() => {
//     fetch(`${BACKEND_URL}/api/products`)
//       .then(res => res.json())
//       .then(data => {
//         // Handle Laravel pagination wrapper if present, or direct array
//         const productList = data.data ? data.data : data; 
//         setProducts(productList);
//         if (productList.length > 0) setProductId(productList[0].id);
//       })
//       .catch(err => {
//         console.error('Failed to load products', err);
//         setError('Failed to load products');
//       });
//   }, [BACKEND_URL]);

//   const generateQr = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setQrData(null);
  
//     try {
//       // Added /api prefix to match routes/api.php
//       const res = await fetch(`${BACKEND_URL}/api/bakong/generate-qr`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ product_id: productId, currency })
//       });
  
//       const response = await res.json();
//       console.log('Backend response:', response);
  
//       if (response.status !== 'success' || !res.ok) {
//         setError(response.message || 'Failed to generate QR');
//         return;
//       }
  
//       // Access nested data object from backend response
//       const data = response.data;
//       setQrData(data.qr_image); // SVG string for display
//       setAmount(`${data.amount} ${data.currency}`);
//       setMerchantRef(data.merchant_ref);
//       setMd5(data.md5);
  
//     } catch (err) {
//       console.error('Frontend fetch error:', err);
//       setError('Failed to generate QR');
//     }
//   };

//   const checkMd5 = async () => {
//     if (!md5) return alert('Enter MD5 value');

//     try {
//         // Added /api prefix
//         const res = await fetch(`${BACKEND_URL}/api/bakong/check-md5`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ md5 }),
//         });

//         const response = await res.json();
//         setCheckResult(response);
//     } catch (err) {
//         console.error(err);
//         setCheckResult({ status: 'error', message: 'Failed to check MD5' });
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-lg">
//       <div className="bg-white shadow rounded p-6">
//         <h1 className="text-2xl font-bold mb-6 text-center">Bakong Payment</h1>

//         {error && <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">{error}</div>}

//         <form onSubmit={generateQr} className="space-y-4">
//           <div>
//             <label className="block mb-1 font-medium text-gray-700">Select Product</label>
//             <select
//               value={productId}
//               onChange={(e) => setProductId(e.target.value)}
//               className="border p-2 rounded w-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
//             >
//               {products.map((p) => (
//                 <option key={p._id} value={p._id}>
//                   {p.name} - {p.price}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium text-gray-700">Currency</label>
//             <select
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//               className="border p-2 rounded w-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="KHR">KHR</option>
//               <option value="USD">USD</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-red-600 text-white px-4 py-3 rounded font-bold hover:bg-red-700 transition"
//           >
//             Generate QR Code
//           </button>
//         </form>

//         {qrData && (
//           <div className="mt-8 text-center border-t pt-6">
//              {/* Render Image URL directly */}
//              <img src={qrData} alt="Bakong QR" className="mx-auto w-48 h-48 border p-2 rounded" />
//             <div className="mt-4 space-y-1">
//                 <p className="text-lg font-bold">{amount}</p>
//                 <p className="text-sm text-gray-500">Ref: {merchantRef}</p>
//             </div>
//           </div>
//         )}

//         {/* MD5 Check Section */}
//         <div className="mt-8 border-t pt-6">
//           <h2 className="font-semibold mb-2">Check Transaction Status</h2>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="MD5 Hash"
//               value={md5}
//               onChange={(e) => setMd5(e.target.value)}
//               className="border p-2 rounded w-full text-sm"
//             />
//             <button
//               onClick={checkMd5}
//               className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
//             >
//               Check
//             </button>
//           </div>

//           {checkResult && (
//             <div className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
//               <pre>{JSON.stringify(checkResult, null, 2)}</pre>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }