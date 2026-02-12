import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="inline-block mb-4">
            <span className="text-lg font-black tracking-tighter uppercase italic">
              Tech<span className="text-indigo-600">Store</span>
            </span>
          </Link>
          <p className="text-xs font-medium text-gray-400 leading-relaxed mb-4">
            High-performance hardware for the modern workspace.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-xs font-bold text-gray-500">
            <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
            <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Inventory</Link></li>
            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Legal Info</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4">Help</h4>
          <ul className="space-y-2 text-xs font-bold text-gray-500">
            <li><Link href="/orders" className="hover:text-indigo-600 transition-colors">Order Tracking</Link></li>
            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Returns</Link></li>
            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Support</Link></li>
          </ul>
        </div>

        {/* Newsletter - Compact Inline */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4">Stay Updated</h4>
          <p className="text-xs text-gray-400 mb-4">Subscribe to our newsletter.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-200"
            />
            <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-50 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
          <p>© {currentYear} TECHSTORE GLOBAL</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}