"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[400]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[401] flex flex-col font-genos"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#002D72]" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#002D72]">Your Bag</h2>
                <span className="bg-[#0072CE] text-white text-[10px] font-black px-2 py-1 rounded-full">{itemCount}</span>
              </div>
              <button onClick={onClose} aria-label="Close cart" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium">Your shopping bag is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-[#0072CE] font-black uppercase text-xs tracking-widest hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black italic uppercase text-[#002D72] leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">Qty: {item.quantity}</p>
                      <p className="text-[#0072CE] font-black">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Subtotal</span>
                  <span className="text-2xl font-black text-[#002D72]">£{subtotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-[#002D72] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0072CE] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 mb-4">
                  Checkout Now <ArrowRight size={18} />
                </button>
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
