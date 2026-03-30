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
import { getProducts, getSiteContent } from "../actions/admin";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  desc: string; 
  description?: string;
  fullSpecs?: string;
}

interface PopupSettings {
  enabled: boolean;
  title: string;
  message: string;
}

const categories = ["Featured", "Merchandise", "Tools", "Digital"];

/* ── Flipping TPI Logo Component ─────────────────────────────────────────────
   Desktop: flips on hover  |  Mobile: flips on tap/touch
   Uses a clean horizontal 3D flip with perspective & backface-visibility.
   Both logo PNGs are transparent — the effect looks seamless.              */
function FlippingLogo({ size = 192, className = "" }: { size?: number; className?: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      /* Desktop: flip on hover in/out */
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      /* Mobile: toggle on tap */
      onTouchStart={(e) => {
        e.preventDefault();
        setFlipped((f) => !f);
      }}
    >
      <div className="relative w-full h-full" style={{ perspective: 2000 }}>
        <div
          className="relative w-full h-full transition-transform duration-1000 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Image
            src="/tpilogo1.png"
            alt="TPI"
            fill
            sizes={`${size}px`}
            className="object-contain"
            style={{ backfaceVisibility: "hidden" }}
            priority
          />
          <Image
            src="/tpilogo2.png"
            alt="TPI"
            fill
            sizes={`${size}px`}
            className="object-contain"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ── Store Popup ──────────────────────────────────────────────────────────────
   Controlled via the admin CMS.  Three CMS keys drive it:
     store.popup.enabled   →  "true" / "false"
     store.popup.title     →  headline text
     store.popup.message   →  body copy                                      */
function StorePopup({ settings, onClose }: { settings: PopupSettings; onClose: () => void }) {
  return (
    <AnimatePresence>
      {settings.enabled && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#002D72]/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#002D72] transition-all"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Top accent bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#002D72] via-[#0072CE] to-[#00A651]" />

            <div className="px-8 pt-10 pb-10 flex flex-col items-center text-center">
              {/* Large flipping logos */}
              <FlippingLogo size={160} className="mb-8" />

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-black text-[#002D72] italic uppercase tracking-tighter leading-none mb-4 font-genos">
                {settings.title}
              </h2>

              {/* Message */}
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm mb-8">
                {settings.message}
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#002D72] text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:bg-[#0072CE] transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Browse anyway <ArrowRight size={16} />
                </button>
                <Link
                  href="/courses"
                  className="flex-1 bg-white border-2 border-[#002D72] text-[#002D72] py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:bg-[#002D72] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  View courses
                </Link>
              </div>

              {/* Cheeky footer line */}
              <p className="text-[11px] text-slate-300 mt-6 italic">
                Our engineers are busy pulling cables, not stocking shelves... yet.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ProductCard({ product, onOpen, onAddToCart }: { product: Product; onOpen: () => void; onAddToCart: () => void }) {
  const displayDesc = product.desc || product.description || "No description available.";
  
  return (
    <motion.div layoutId={`prod-${product.id}`} whileHover={{ y: -10 }} onClick={onOpen} className="col-span-1 lg:col-span-3 group cursor-pointer font-proper">
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
  const [checkoutModal, setCheckoutModal] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // POPUP STATE — driven by CMS
  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    enabled: false,
    title: "We're stocking up!",
    message: "Our store is live but products are still being loaded. Come back soon — it'll be worth the wait.",
  });
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const data = await getProducts();
        if (data) setAllProducts(data as Product[]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setIsLoading(false);
    }

    async function fetchPopupSettings() {
      try {
        const cmsData = await getSiteContent();
        if (cmsData && Array.isArray(cmsData)) {
          const popupEntries = cmsData.filter(
            (c: { page: string; section: string }) => c.page === "store" && c.section === "popup"
          );
          if (popupEntries.length > 0) {
            const getVal = (id: string) =>
              (popupEntries.find((e: { id: string }) => e.id === id) as { content: string } | undefined)?.content || "";
            const isEnabled = getVal("store.popup.enabled") === "true";
            const title = getVal("store.popup.title");
            const message = getVal("store.popup.message");
            setPopupSettings({
              enabled: isEnabled,
              title: title || "We're stocking up!",
              message: message || "Our store is live but products are still being loaded. Come back soon — it'll be worth the wait.",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching popup settings:", err);
      }
    }
    
    fetchLiveProducts();
    fetchPopupSettings();
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

      {/* ── CMS-CONTROLLED STORE POPUP ──────────────────────────────────── */}
      {!popupDismissed && (
        <StorePopup settings={popupSettings} onClose={() => setPopupDismissed(true)} />
      )}

      <main className="relative z-10 pt-32 md:pt-48 pb-16 md:pb-32 overflow-x-hidden">
        {/* HERO */}
        <section className="px-4 md:px-8 max-w-[1400px] mx-auto mb-16 md:mb-24">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs">TPI Store</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-[110px] font-black italic tracking-tighter text-[#002D72] mt-4 leading-none uppercase font-genos">
            THE <span className="text-[#0072CE]">KIT.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-xl mt-6 md:mt-8 text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Professional grade tools, branded gear, and digital resources built for data cabling engineers.
          </motion.p>
        </section>

        {/* FILTERS + SEARCH */}
        <section className="px-4 md:px-8 max-w-[1400px] mx-auto mb-12 md:mb-16 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {["Featured", ...categories.filter(c => c !== "Featured")].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 md:px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all border ${activeCategory === cat ? "bg-[#002D72] text-white border-[#002D72] shadow-xl" : "bg-white text-[#002D72] border-slate-200 hover:border-[#002D72]"}`}>{cat}</button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-[#0072CE]/20 w-full sm:w-64 shadow-sm" />
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="px-4 md:px-8 max-w-[1400px] mx-auto min-h-[40vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#0072CE] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} onAddToCart={() => handleAddToCart(product)} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-1 lg:col-span-12 py-16 md:py-24 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm w-full">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-black uppercase text-xl italic">No products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* STORE QUICK LINKS */}
        <section className="px-4 md:px-8 max-w-[1400px] mx-auto mt-20 md:mt-40 w-full overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-12 w-full">
            <div className="lg:col-span-5 bg-[#002D72] rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col justify-center w-full">
              <span className="text-[#00A651] font-black uppercase tracking-widest text-xs mb-4">Need guidance?</span>
              <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-tight mb-8">Talk to the <br /> team first.</h3>
              <Link href="/#contact">
                <button className="w-full md:w-auto bg-white text-[#002D72] px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#00A651] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">Get in touch <ArrowRight size={16} /></button>
              </Link>
            </div>
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 shadow-xl w-full">
              <h4 className="text-xl md:text-2xl font-black text-[#0072CE] italic uppercase mb-8 md:mb-12 leading-tight">Store quick links</h4>
              <div className="flex flex-col gap-6">
                <Link href="/store" className="text-[#002D72] font-black text-xl md:text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">Continue browsing <ArrowRight size={20} /></Link>
                <Link href="/courses" className="text-[#002D72] font-black text-xl md:text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">View training courses <ArrowRight size={20} /></Link>
                <a href="mailto:e.osobu@thephysicalinternet.uk" className="text-[#002D72] font-black text-xl md:text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">Order enquiry <ArrowRight size={20} /></a>
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
            <motion.div layoutId={`prod-${selectedProduct.id}`} className="relative w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:grid lg:grid-cols-12 max-h-[95vh]">
              <div className="col-span-1 lg:col-span-7 bg-slate-50 p-6 md:p-8 flex items-center justify-center relative shrink-0">
                <button onClick={() => setSelectedProduct(null)} aria-label="Close" className="absolute top-4 left-4 md:top-10 md:left-10 flex items-center gap-2 text-[#002D72] font-black uppercase text-[10px] tracking-widest hover:text-[#0072CE] transition-colors z-20 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full md:bg-transparent md:px-0 md:py-0"><X size={16} /> <span className="hidden md:inline">Continue browsing</span></button>
                <div className="relative w-full h-[250px] md:h-[600px]">
                  {selectedProduct.image ? (
                    <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain mix-blend-multiply transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </div>
              </div>
              <div className="col-span-1 lg:col-span-5 p-6 md:p-12 lg:p-16 flex flex-col justify-center font-genos relative bg-white overflow-y-auto">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <span className="bg-[#00A651]/10 text-[#00A651] px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest">{selectedProduct.category}</span>
                  <button aria-label="Share" className="text-slate-300 hover:text-[#002D72] transition-colors"><Share2 size={20} /></button>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#002D72] italic uppercase tracking-tighter leading-none mb-3 md:mb-4">{selectedProduct.name}</h2>
                <p className="text-2xl md:text-3xl font-black text-[#0072CE] mb-6 md:mb-8">£{selectedProduct.price.toFixed(2)}</p>
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 text-proper">
                  <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-1 md:mb-2 font-genos">Description</h4><p className="text-slate-500 leading-relaxed text-base md:text-lg">{selectedProduct.desc || selectedProduct.description || "No description provided."}</p></div>
                  {selectedProduct.fullSpecs && (
                    <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-1 md:mb-2 font-genos">Technical Specifications</h4><p className="text-slate-400 text-sm leading-relaxed">{selectedProduct.fullSpecs}</p></div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }} 
                    className="w-full bg-white border-2 border-[#002D72] text-[#002D72] py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#002D72] hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    Add to bag
                  </button>
                  <button 
                    onClick={() => setCheckoutModal(true)} 
                    className="w-full bg-[#002D72] text-white py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0072CE] transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    Buy Now <ArrowRight size={18} />
                  </button>
                </div>
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100 flex items-center gap-4 md:gap-6 shrink-0 flex-wrap">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={16} className="text-[#00A651]" /> Secure payment</div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><CreditCard size={16} className="text-[#0072CE]" /> UK shipping</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {checkoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutModal(false)} />
          <div className="relative bg-white rounded-[2rem] p-8 md:p-12 max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-black text-[#002D72] mb-4 uppercase italic">Coming Soon!</h2>
            <p className="text-slate-600 mb-6 font-medium">
              Online payments are not yet available. To place an order, please contact us directly:
            </p>
            <a 
              href="mailto:e.osobu@thephysicalinternet.uk"
              className="block bg-[#002D72] text-white py-4 px-8 rounded-2xl font-bold hover:bg-[#0072CE] transition-colors"
            >
              e.osobu@thephysicalinternet.uk
            </a>
            <button 
              onClick={() => setCheckoutModal(false)}
              className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-proper { text-transform: none; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
}