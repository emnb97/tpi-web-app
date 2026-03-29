"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Share2, ShieldCheck, CreditCard, Search, Package } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../context/CartContext";
import { getProducts } from "../actions/admin";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  desc: string; 
  description?: string; // Mapped from DB
  fullSpecs?: string;
}

const categories = ["Featured", "Merchandise", "Tools", "Digital"];

function ProductCard({ product, onOpen, onAddToCart }: { product: Product; onOpen: () => void; onAddToCart: () => void }) {
  // Map 'description' from DB if 'desc' is missing
  const displayDesc = product.desc || product.description || "No description available.";
  
  return (
    <motion.div layoutId={`prod-${product.id}`} whileHover={{ y: -10 }} onClick={onOpen} className="col-span-12 md:col-span-6 lg:col-span-3 group cursor-pointer font-proper">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden p-4 transition-all group-hover:border-[#0072CE]/30 h-full flex flex-col">
        <div className="relative aspect-square rounded-[2.5rem] bg-slate-50 overflow-hidden mb-6 shrink-0">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill sizes="400px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">No Image</div>
          )}
          <div className="absolute top-6 right-6"><div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-[#002D72] text-xs shadow-lg border border-slate-100">£{product.price.toFixed(2)}</div></div>
        </div>
        <div className="px-4 pb-4 font-genos flex flex-col flex-grow">
          <motion.h3 whileHover={{ textShadow: "0px 0px 20px rgba(0,114,206,0.4)" }} className="text-2xl font-black text-[#002D72] italic uppercase leading-none transition-all mb-2">{product.name}</motion.h3>
          <p className="text-slate-400 text-sm mb-6 leading-tight text-proper flex-grow line-clamp-2">{displayDesc}</p>
          <div className="flex items-center justify-between mt-auto pt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00A651]">{product.stock > 5 ? "In Stock" : product.stock > 0 ? `${product.stock} left` : "Out of Stock"}</span>
            <div className="bg-[#002D72] text-white p-4 rounded-2xl hover:bg-[#0072CE] transition-all" onClick={(e) => { e.stopPropagation(); onAddToCart(); }}>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoreClient() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  
  // LIVE DATA STATES
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH FROM SUPABASE VIA SERVER ACTION
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const data = await getProducts();
        if (data) {
          setAllProducts(data as Product[]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setIsLoading(false);
    }
    
    fetchLiveProducts();
    setMounted(true); 
  }, []);

  const filteredProducts = allProducts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.desc || p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!mounted) return null;

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setCartOpen(true);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#0072CE] selection:text-white overflow-x-hidden bg-[#F8FAFC]">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 pt-48 pb-32">
        {/* HERO */}
        <section className="px-8 max-w-[1400px] mx-auto mb-24">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs">TPI Store</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-7xl md:text-[110px] font-black italic tracking-tighter text-[#002D72] mt-4 leading-none uppercase font-genos">
            THE <span className="text-[#0072CE]">KIT.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-xl mt-8 text-slate-500 text-xl font-medium leading-relaxed">
            Professional grade tools, branded gear, and digital resources built for data cabling engineers.
          </motion.p>
        </section>

        {/* FILTERS + SEARCH */}
        <section className="px-8 max-w-[1400px] mx-auto mb-16 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {["Featured", ...categories.filter(c => c !== "Featured")].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all border ${activeCategory === cat ? "bg-[#002D72] text-white border-[#002D72] shadow-xl" : "bg-white text-[#002D72] border-slate-200 hover:border-[#002D72]"}`}>{cat}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-[#0072CE]/20 w-64 shadow-sm" />
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="px-8 max-w-[1400px] mx-auto min-h-[40vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#0072CE] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} onAddToCart={() => handleAddToCart(product)} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-12 py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-black uppercase text-xl italic">No products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* STORE QUICK LINKS */}
        <section className="px-8 max-w-[1400px] mx-auto mt-40">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 lg:col-span-5 bg-[#002D72] rounded-[4rem] p-16 flex flex-col justify-center">
              <span className="text-[#00A651] font-black uppercase tracking-widest text-xs mb-4">Need guidance?</span>
              <h3 className="text-5xl font-black italic uppercase text-white leading-tight mb-8">Talk to the <br /> team first.</h3>
              <Link href="/#contact">
                <button className="bg-white text-[#002D72] px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#00A651] hover:text-white transition-all shadow-xl flex items-center gap-3">Get in touch <ArrowRight size={16} /></button>
              </Link>
            </div>
            <div className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-[4rem] p-16 shadow-xl">
              <h4 className="text-2xl font-black text-[#0072CE] italic uppercase mb-12 leading-tight">Store quick links</h4>
              <div className="flex flex-col gap-6">
                <Link href="/store" className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">Continue browsing <ArrowRight size={20} /></Link>
                <Link href="/courses" className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">View training courses <ArrowRight size={20} /></Link>
                <a href="mailto:e.osobu@thephysicalinternet.uk" className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">Order enquiry <ArrowRight size={20} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-2xl" />
            <motion.div layoutId={`prod-${selectedProduct.id}`} className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-12">
              <div className="col-span-12 lg:col-span-7 bg-slate-50 p-8 flex items-center justify-center relative">
                <button onClick={() => setSelectedProduct(null)} aria-label="Close" className="absolute top-10 left-10 flex items-center gap-2 text-[#002D72] font-black uppercase text-[10px] tracking-widest hover:text-[#0072CE] transition-colors z-20"><X size={16} /> Continue browsing</button>
                <div className="relative w-full h-[600px]">
                  {selectedProduct.image ? (
                    <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="800px" className="object-contain mix-blend-multiply transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 p-12 md:p-16 flex flex-col justify-center font-genos relative bg-white">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#00A651]/10 text-[#00A651] px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest">{selectedProduct.category}</span>
                  <button aria-label="Share" className="text-slate-300 hover:text-[#002D72] transition-colors"><Share2 size={20} /></button>
                </div>
                <h2 className="text-5xl font-black text-[#002D72] italic uppercase tracking-tighter leading-none mb-4">{selectedProduct.name}</h2>
                <p className="text-3xl font-black text-[#0072CE] mb-8">£{selectedProduct.price.toFixed(2)}</p>
                <div className="space-y-6 mb-10 text-proper">
                  <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-2 font-genos">Description</h4><p className="text-slate-500 leading-relaxed text-lg">{selectedProduct.desc || selectedProduct.description || "No description provided."}</p></div>
                  {selectedProduct.fullSpecs && (
                    <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-2 font-genos">Technical Specifications</h4><p className="text-slate-400 text-sm leading-relaxed">{selectedProduct.fullSpecs}</p></div>
                  )}
                </div>
                <div className="space-y-3">
                  <button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-[#002D72] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0072CE] transition-all flex items-center justify-center gap-3 shadow-xl">Add to bag <ArrowRight size={18} /></button>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={16} className="text-[#00A651]" /> Secure payment</div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><CreditCard size={16} className="text-[#0072CE]" /> UK shipping</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-proper { text-transform: none; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
}