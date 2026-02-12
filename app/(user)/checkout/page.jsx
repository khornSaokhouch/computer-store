"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Truck, CreditCard, MapPin, Phone, User, Loader2, ChevronRight } from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import { usePaymentStore } from "../../store/paymentStore";
import { usePaymentAccountStore } from "../../store/paymentAccountStore";
import PaymentModal from "../../components/checkout/PaymentModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice } = useCartStore();
  const { placeOrder, loading: orderLoading } = useOrderStore();
  const { fetchAccountById } = usePaymentAccountStore();
  const { createPayment } = usePaymentStore();

  const [deliveryInfo, setDeliveryInfo] = useState({ fullName: "", phone: "", address: "", city: "" });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [derivedAccounts, setDerivedAccounts] = useState([]);

  useEffect(() => {
    const fetchMissingAccounts = async () => {
      const accs = [];
      for (const item of cart) {
        let pAcc = item.product?.paymentAccount;
        if (pAcc && typeof pAcc === 'string') {
          const existing = accs.find(a => a._id === pAcc);
          if (!existing) {
             const fetched = await fetchAccountById(pAcc);
             if (fetched) pAcc = fetched;
          }
        }
        if (pAcc && typeof pAcc === 'object' && pAcc._id) {
           if (!accs.find(a => a._id === pAcc._id)) accs.push(pAcc);
        }
      }
      setDerivedAccounts(accs);
    };
    if (cart.length > 0) fetchMissingAccounts();
  }, [cart, fetchAccountById]);

  useEffect(() => { 
    if (derivedAccounts.length > 0 && !selectedPayment) {
      setSelectedPayment(String(derivedAccounts[0]._id)); 
    }
  }, [derivedAccounts, selectedPayment]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const account = derivedAccounts.find((a) => String(a._id) === String(selectedPayment));
    if (!account) return alert("Select a payment method.");
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.city) {
      return alert("Please fill in shipping details.");
    }

    setQrLoading(true);
    try {
      const qrResult = await createPayment({ amount: totalPrice(), paymentAccountId: account._id });
      if (qrResult) {
        setQrData(qrResult);
        setShowModal(true);
      }
    } catch (err) {
      alert("Payment failed to initiate.");
    } finally { setQrLoading(false); }
  };

  const handleFinalizeOrder = async () => {
    const account = derivedAccounts.find((a) => String(a._id) === String(selectedPayment));
    try {
      const newOrder = await placeOrder({
        items: cart.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.product.price })),
        shippingAddress: deliveryInfo,
        paymentMethod: account.type,
        paymentAccountId: account._id,
        status: "paid",
      });
      if (newOrder?._id) {
        useCartStore.getState().clearCart();
        router.push("/orders");
      }
    } catch (err) { alert("Failed to save order."); }
  };

  if (!cart.length && !showModal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-6">
        <ShoppingBag size={48} className="text-gray-100 mb-4" />
        <h2 className="text-lg font-black uppercase tracking-tight mb-4">Cart is empty</h2>
        <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-8">
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Step</p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">SECURE CHECKOUT</h1>
        </header>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Shipping and Payment */}
          <div className="lg:col-span-8 space-y-6">
            <Section title="Shipping Info" icon={<Truck size={14}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" icon={<User size={14}/>} value={deliveryInfo.fullName} onChange={(v) => setDeliveryInfo({...deliveryInfo, fullName: v})} />
                <FormInput label="Phone" icon={<Phone size={14}/>} value={deliveryInfo.phone} onChange={(v) => setDeliveryInfo({...deliveryInfo, phone: v})} />
                <div className="md:col-span-2">
                  <FormInput label="Full Address" icon={<MapPin size={14}/>} value={deliveryInfo.address} onChange={(v) => setDeliveryInfo({...deliveryInfo, address: v})} />
                </div>
                <FormInput label="City" icon={<MapPin size={14}/>} value={deliveryInfo.city} onChange={(v) => setDeliveryInfo({...deliveryInfo, city: v})} />
              </div>
            </Section>

            <Section title="Payment Method" icon={<CreditCard size={14}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {derivedAccounts.map((acc) => {
                  const isSelected = String(selectedPayment) === String(acc._id);
                  return (
                    <button key={acc._id} type="button" onClick={() => setSelectedPayment(String(acc._id))}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        isSelected ? "border-indigo-600 bg-indigo-50/30" : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400"}`}>
                        <CreditCard size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[10px] uppercase tracking-tight text-gray-900 truncate">{acc.type || "Bank"}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{acc.userName}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* RIGHT: Order Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Order Items</h3>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 relative rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-50">
                      <Image src={item.product.images?.[0] || "/placeholder.png"} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400">{item.quantity} × ${item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-xl font-black text-indigo-600">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button disabled={orderLoading || qrLoading} className="w-full mt-6 bg-gray-900 hover:bg-indigo-600 disabled:bg-gray-100 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                {orderLoading || qrLoading ? <Loader2 className="animate-spin" size={16} /> : <>Continue to Pay <ChevronRight size={14}/></>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showModal && qrData && (
        <PaymentModal 
          qrData={qrData} 
          selectedAccount={derivedAccounts.find(a => String(a._id) === String(selectedPayment))} 
          onClose={() => setShowModal(false)}
          total={totalPrice()}
          onRetry={() => handlePlaceOrder({ preventDefault: () => {} })}
          onSuccess={() => { setShowModal(false); handleFinalizeOrder(); }}
        />
      )}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
        <div className="text-indigo-600">{icon}</div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FormInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>
        <input {...props} onChange={(e) => props.onChange(e.target.value)} 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-200 outline-none text-xs font-bold transition-all" 
        />
      </div>
    </div>
  );
}