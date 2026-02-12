"use client";
import { useEffect, useRef, useState } from "react";
import { X, Loader2, CheckCircle2, Download, Share2, AlertCircle, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import { useCheckMd5Store } from "../../store/checkMd5Store";

export default function PaymentModal({ qrData, selectedAccount, onClose, onSuccess, onRetry, total }) {
  const cardRef = useRef(null);
  const { startPolling, isPaid, resetStatus, pollIntervalId } = useCheckMd5Store();

  const [timeLeft, setTimeLeft] = useState(120); 
  const [isExpired, setIsExpired] = useState(false);

useEffect(() => {
  setTimeLeft(120);
  setIsExpired(false);

  // --- START POLLING ---
  startPolling(qrData.md5, () => {
    setTimeout(() => onSuccess(), 1500);
  });

  // --- TIMER ---
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        setIsExpired(true);

        // Stop polling safely
        const { pollIntervalId } = useCheckMd5Store.getState();
        if (pollIntervalId) clearInterval(pollIntervalId);

        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    // Only cleanup intervals on unmount
    const { pollIntervalId } = useCheckMd5Store.getState();
    if (pollIntervalId) clearInterval(pollIntervalId);

    clearInterval(timer);

    // resetStatus is safe here
    useCheckMd5Store.getState().resetStatus();
  };
}, [qrData.md5, startPolling, onSuccess]);


  // --- DOWNLOAD QR ---
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, 
        backgroundColor: "#ffffff",
        filter: node => node.tagName !== "BUTTON",
      });
      const link = document.createElement("a");
      link.download = `KHQR_Payment_${total}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error(err); }
  };

  // --- SHARE QR ---
  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, 
        backgroundColor: "#ffffff",
        filter: node => node.tagName !== "BUTTON",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "KHQR_Payment.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "KHQR Payment" });
      } else handleDownload();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div 
        ref={cardRef}
        className="bg-white rounded-[2rem] w-full max-w-[350px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="relative">
          <div className="bg-[#E11D2A] h-20 flex items-center justify-center rounded-t-[2rem]">
            <img src="/img/header.png" alt="KHQR Logo" className="h-14 w-auto object-contain" />
            <button onClick={onClose} className="absolute top-4 right-5 p-1 hover:bg-white/10 rounded-full transition-colors z-20">
              <X size={18} className="text-white/70" />
            </button>
          </div>
          <div className="absolute right-0 -bottom-5 w-10 h-6 bg-[#E11D2A]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
        </div>

        <div className="p-0">
          {isPaid ? (
            /* SUCCESS VIEW */
            <div className="py-24 text-center animate-in fade-in zoom-in duration-500 px-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payment Success</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Order processing...</p>
            </div>
          ) : isExpired ? (
            /* EXPIRED VIEW */
            <div className="py-24 text-center animate-in fade-in zoom-in duration-500 px-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Session Expired</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest mb-8 text-center">Security timeout reached.</p>
              
              <button 
                onClick={onRetry} 
                className="flex items-center justify-center gap-2 mx-auto py-3 px-8 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                <RefreshCw size={14} /> Retry Payment
              </button>
            </div>
          ) : (
            /* ACTIVE QR VIEW */
            <>
              <div className="px-10 pt-6 pb-8">
                <div className="flex justify-between items-start">
                  <p className="text-[12px] font-bold text-[#7b869d] uppercase tracking-[0.1em] mb-2 truncate">
                    {selectedAccount?.userName || "MERCHANT"}
                  </p>
                  <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{total.toLocaleString()}</p>
                  <p className="text-xl font-bold text-slate-900 uppercase italic tracking-tighter">{selectedAccount?.currency || "KHR"}</p>
                </div>
              </div>

              <div className="relative flex items-center px-4">
                <div className="absolute left-[-12px] w-6 h-6 bg-white rounded-full shadow-inner border-r border-slate-100"></div>
                <div className="flex-1 border-t-2 border-dashed border-slate-100 mx-6"></div>
                <div className="absolute right-[-12px] w-6 h-6 bg-white rounded-full shadow-inner border-l border-slate-100"></div>
              </div>

              <div className="p-9 pt-6 flex flex-col items-center">
                <div className="relative bg-white p-1 rounded-sm shadow-sm border border-slate-50">
                  <img src={qrData.qrCode} alt="KHQR" className="w-52 h-52 object-contain block" crossOrigin="anonymous" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                    <img src="/img/khqr.png" alt="Center Logo" className="w-8 h-8 object-contain rounded-full" />
                  </div>
                </div>

                <div className="flex gap-4 mt-6 w-full">
                  <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 transition-colors text-[11px] font-bold uppercase tracking-wider">
                    <Download size={16} /> Save
                  </button>
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 transition-colors text-[11px] font-bold uppercase tracking-wider">
                    <Share2 size={16} /> Share
                  </button>
                </div>

                <div className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-[#f8faff] rounded-full border border-slate-50">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                  <span className="text-[11px] font-black text-[#7b869d] uppercase tracking-[0.15em]">WAITING FOR PAYMENT</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
