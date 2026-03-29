"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, ArrowRight, Instagram, Mail, Linkedin, X, Share2, ShieldCheck, CreditCard } from "lucide-react";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  desc: string;
  fullSpecs?: string;
}

const BackgroundWires = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F8FAFC]">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-60">
      <motion.path d="M-5 20 C 30 20, 70 80, 105 80" stroke="#002D72" strokeWidth="0.2" fill="none" strokeOpacity="0.1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: "easeInOut" }} />
      <motion.path d="M-5 80 C 40 80, 60 20, 105 20" stroke="#00A651" strokeWidth="0.15" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 6, ease: "easeInOut", delay: 1 }} />
    </svg>
  </div>
);

export default function StorePage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [navVisible, setNavVisible] = useState(true);
  
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart, itemCount } = useCart();

  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [100, 300], [1, 0]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  });

  // Use the cart context's addToCart
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    setCartOpen(true);
  };

  // REPAIRED: Consistent Nav Items with Courses Route
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Training & courses", href: "/courses" },
    { label: "Installation services", href: "/services" },
    { label: "Store", href: "/store" }
  ];

  const allProducts: Product[] = [
    { id: 101, name: "Limited Edition Crimper", price: 55, category: "Featured", image: "/feat1.png", stock: 3, desc: "Special edition matte black precision crimpers.", fullSpecs: "Hardened industrial steel, precision-ground crimping dies, and ergonomic TPI-branded non-slip handles." },
    { id: 102, name: "TPI Launch Bundle", price: 120, category: "Featured", image: "/feat2.png", stock: 10, desc: "Full starter kit including hoodie and basic tools.", fullSpecs: "Includes 1x Signature Hoodie, 1x Punch down tool, and a 100-pack of shielded RJ45 connectors." },
    { id: 103, name: "Fiber Master Kit", price: 299, category: "Featured", image: "/feat3.png", stock: 2, desc: "Elite fiber splicing and testing equipment.", fullSpecs: "Professional grade VFL, optical power meter, and precision fiber cleaver in a shockproof TPI carry case." },
    { id: 104, name: "The Networker Tee", price: 25, category: "Featured", image: "/feat4.png", stock: 25, desc: "Breathable technical tee for field engineers.", fullSpecs: "Moisture-wicking fabric, athletic fit, featuring the high-vis TPI logo on chest and back." },
    { id: 201, name: "Apparel Item 1", price: 35, category: "Merchandise", image: "/merch1.png", stock: 20, desc: "Premium TPI branded engineering apparel.", fullSpecs: "Heavyweight cotton blend designed for comfort during long site installations." },
    { id: 301, name: "Industrial Tool 1", price: 65, category: "Tools", image: "/tool1.png", stock: 15, desc: "Heavy duty equipment for physical infrastructure.", fullSpecs: "Spec-grade hardware tested for continuous use in data center environments." },
  ];

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#0072CE] selection:text-white overflow-x-hidden">
      <BackgroundWires />
      
      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />

      {/* REPAIRED: Top Left Logo Anchor explicitly z-indexed for visibility */}
      <Link href="/">
        <motion.div style={{ opacity: logoOpacity }} className="fixed top-2 left-10 z-[1000] w-48 h-48 cursor-pointer">
          <div className="relative w-full h-full group [perspective:2000px]">
            <div className="relative w-full h-full transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <Image src="/tpilogo.png" alt="TPI" fill sizes="192px" className="object-contain [backface-visibility:hidden]" priority />
              <Image src="/tpilogo2.png" alt="TPI" fill sizes="192px" className="object-contain [backface-visibility:hidden] [transform:rotateY(180deg)]" priority />
            </div>
          </div>
        </motion.div>
      </Link>
      
      <motion.nav 
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 } }}
        animate={navVisible ? "visible" : "hidden"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-12 right-12 z-[110]"
      >
        <div className="hidden md:flex gap-2 bg-white/80 backdrop-blur-2xl border border-slate-100 px-6 py-3 rounded-full shadow-2xl items-center">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="relative h-6 overflow-hidden group cursor-pointer px-4">
                <motion.div className="flex flex-col transition-all duration-500 ease-in-out group-hover:-translate-y-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#002D72] leading-6 whitespace-nowrap">{item.label}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0072CE] leading-6 whitespace-nowrap">{item.label}</span>
                </motion.div>
              </div>
            </Link>
          ))}
          <div className="border-l border-slate-200 ml-2 pl-4 flex items-center">
            <button onClick={() => setCartOpen(true)}>
              <ShoppingCart size={18} className="text-[#002D72] cursor-pointer hover:text-[#0072CE]" />
            </button>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 pt-48 mb-[75vh] bg-transparent">
        <section className="px-8 max-w-[1400px] mx-auto mb-20">
          <div className="relative h-80 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 bg-white">
            <Image src="/storehero.png" alt="Store Hero" fill sizes="1400px" className="object-cover brightness-75" />
            <div className="absolute inset-0 bg-[#002D72]/40 flex flex-col justify-center px-16">
              <motion.h1 whileHover={{ textShadow: "0px 0px 30px rgba(0,114,206,0.6)" }} className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none transition-all duration-300">Build the <br/> <span className="text-[#0072CE]">Network.</span></motion.h1>
            </div>
          </div>
        </section>

        <section className="px-8 max-w-[1400px] mx-auto mb-12">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {["Featured", "Merchandise", "Tools", "Fiber", "PPE"].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? "bg-[#002D72] text-white shadow-xl" : "bg-white text-slate-400 border border-slate-100 hover:border-[#0072CE]"}`}>{cat}</button>
            ))}
          </div>
        </section>

        <section className="px-8 max-w-[1400px] mx-auto mb-24 font-proper">
          <h2 className="text-4xl font-black text-[#002D72] italic uppercase tracking-tighter mb-8 font-genos text-proper">Get it before its gone!</h2>
          <div className="grid grid-cols-12 gap-8">
            {allProducts.filter(p => p.category === "Featured").map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} addToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section className="px-8 max-w-[1400px] mx-auto mb-24 font-proper">
          <h2 className="text-4xl font-black text-[#002D72] italic uppercase tracking-tighter mb-8 font-genos text-proper">TPI Merchandise</h2>
          <div className="grid grid-cols-12 gap-8">
            {allProducts.filter(p => p.category === "Merchandise").map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} addToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section className="px-8 max-w-[1400px] mx-auto mb-16 font-proper">
          <h2 className="text-4xl font-black text-[#002D72] italic uppercase tracking-tighter mb-8 font-genos text-proper">Tools & PPE</h2>
          <div className="grid grid-cols-12 gap-8">
             {allProducts.filter(p => p.category === "Tools").map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} addToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-12">
            <div className="col-span-12 lg:col-span-7 p-12 md:p-20 border-r border-slate-50">
              <h2 className="text-6xl font-black text-[#002D72] italic uppercase tracking-tighter mb-4 leading-none text-proper">Stay Connected.</h2>
              <p className="text-xl text-slate-400 font-genos mb-12 text-proper">Sign up here to get regular updates on the industry, and all news TPI</p>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" placeholder="Name" className="bg-slate-50 border-none rounded-3xl p-6 font-genos text-lg focus:ring-2 focus:ring-[#0072CE]/20 outline-none w-full" />
                  <input type="email" placeholder="Email" className="bg-slate-50 border-none rounded-3xl p-6 font-genos text-lg focus:ring-2 focus:ring-[#0072CE]/20 outline-none w-full" />
                </div>
                <input type="tel" placeholder="Phone number" className="bg-slate-50 border-none rounded-3xl p-6 font-genos text-lg focus:ring-2 focus:ring-[#0072CE]/20 outline-none w-full" />
                <button type="submit" className="bg-[#002D72] text-white w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#0072CE] transition-all shadow-xl">Join the network</button>
              </form>
            </div>
            <div className="col-span-12 lg:col-span-5 p-12 md:p-20 bg-slate-50/50 flex flex-col justify-center font-genos text-proper">
              <h4 className="text-2xl font-black text-[#0072CE] italic uppercase mb-12 leading-tight">Store quick links</h4>
              <div className="flex flex-col gap-6">
                <Link href="/store" className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">Continue browsing <ArrowRight size={20}/></Link>
                <button className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors text-left flex items-center gap-3">Checkout now <ArrowRight size={20}/></button>
                <button className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors text-left flex items-center gap-3" onClick={() => setCartOpen(true)}>My shopping bag <ArrowRight size={20}/></button>
                <Link href="/courses" className="text-[#002D72] font-black text-2xl hover:text-[#00A651] transition-colors flex items-center gap-3">View training courses <ArrowRight size={20}/></Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 font-proper">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-2xl" />
            <motion.div layoutId={`prod-${selectedProduct.id}`} className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-12">
              <div className="col-span-12 lg:col-span-7 bg-slate-50 p-8 flex items-center justify-center relative">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-10 left-10 flex items-center gap-2 text-[#002D72] font-black uppercase text-[10px] tracking-widest hover:text-[#0072CE] transition-colors z-20"><X size={16}/> Continue browsing</button>
                <div className="relative w-full h-[600px]">
                   <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="800px" className="object-contain mix-blend-multiply transition-transform duration-700" />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 p-12 md:p-16 flex flex-col justify-center font-genos relative bg-white">
                <div className="flex justify-between items-start mb-6"><span className="bg-[#00A651]/10 text-[#00A651] px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest">{selectedProduct.category}</span><button className="text-slate-300 hover:text-[#002D72] transition-colors"><Share2 size={20}/></button></div>
                <h2 className="text-5xl font-black text-[#002D72] italic uppercase tracking-tighter leading-none mb-4">{selectedProduct.name}</h2>
                <p className="text-3xl font-black text-[#0072CE] mb-8">£{selectedProduct.price.toFixed(2)}</p>
                <div className="space-y-6 mb-10 text-proper">
                  <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-2 font-genos">Description</h4><p className="text-slate-500 leading-relaxed text-lg">{selectedProduct.desc}</p></div>
                  <div><h4 className="text-[#002D72] font-black uppercase text-xs tracking-widest mb-2 font-genos">Technical Specifications</h4><p className="text-slate-400 text-sm leading-relaxed">{selectedProduct.fullSpecs || "Standard industrial specifications apply."}</p></div>
                </div>
                <div className="space-y-3">
                  <button onClick={() => handleAddToCart(selectedProduct)} className="w-full bg-[#002D72] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0072CE] transition-all flex items-center justify-center gap-3 shadow-xl">Add to bag <ArrowRight size={18}/></button>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={16} className="text-[#00A651]"/> Secure payment</div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest"><CreditCard size={16} className="text-[#0072CE]"/> Global shipping</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="sticky bottom-0 left-0 w-full h-[75vh] bg-[#002D72] text-white z-0 flex flex-col justify-between p-12 md:p-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-12 font-genos font-proper">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="text-[12vw] lg:text-[8vw] font-black italic tracking-tighter leading-[0.8] mb-12 text-proper">Stay Connected.</h2>
            <div className="flex gap-4">
               <a href="https://www.instagram.com/thephysicalinternet" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 rounded-2xl hover:bg-[#00A651] transition-colors cursor-pointer"><Instagram size={28}/></a>
               <div className="p-4 bg-white/10 rounded-2xl hover:bg-[#0072CE] transition-colors cursor-pointer"><Linkedin size={28}/></div>
               <a href="mailto:e.osobu@thephysicalinternet.uk" className="p-4 bg-white/10 rounded-2xl hover:bg-white hover:text-[#002D72] transition-colors cursor-pointer"><Mail size={28}/></a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-8 uppercase font-black text-xs tracking-[0.2em] text-proper">
            <div className="flex flex-col gap-6">
              <span className="text-[#00A651] font-genos">Platform</span>
              <Link href="/" className="opacity-40 hover:opacity-100 transition-opacity">Home</Link>
              <Link href="/courses" className="opacity-40 hover:opacity-100 transition-opacity">Training & courses</Link>
              <Link href="/store" className="opacity-40 hover:opacity-100 transition-opacity">Store</Link>
            </div>
            <div className="flex flex-col gap-6 text-right">
              <span className="text-[#0072CE] font-genos">Legal</span>
              <Link href="/legal" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">Legal page</Link>
              <Link href="/terms" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">T&Cs</Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto w-full pt-12 border-t border-white/10 text-[10px] opacity-40 uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between gap-4 font-proper">
          <div className="flex flex-col gap-1">
            <p className="font-black">The Physical Internet ltd</p>
            <p>86-90 Paul street, 3rd floor, London, England, EC2A 4NE</p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="font-black">07487361240</p>
            <p>© 2026 The Physical Internet. Registered in England & Wales.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-proper { text-transform: none; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
}

function ProductCard({ product, onOpen, addToCart }: { product: Product, onOpen: () => void, addToCart: (p: Product) => void }) {
  return (
    <motion.div layoutId={`prod-${product.id}`} whileHover={{ y: -10 }} onClick={onOpen} className="col-span-12 md:col-span-6 lg:col-span-3 group cursor-pointer font-proper">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden p-4 transition-all group-hover:border-[#0072CE]/30">
        <div className="relative aspect-square rounded-[2.5rem] bg-slate-50 overflow-hidden mb-6">
          <Image src={product.image} alt={product.name} fill sizes="400px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-6 right-6"><div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-[#002D72] text-xs shadow-lg border border-slate-100">£{product.price.toFixed(2)}</div></div>
        </div>
        <div className="px-4 pb-4 font-genos">
          <motion.h3 whileHover={{ textShadow: "0px 0px 20px rgba(0,114,206,0.4)" }} className="text-2xl font-black text-[#002D72] italic uppercase leading-none transition-all mb-2">{product.name}</motion.h3>
          <p className="text-slate-400 text-sm mb-6 leading-tight text-proper">{product.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00A651]">In Stock</span>
            <div 
              className="bg-[#002D72] text-white p-4 rounded-2xl hover:bg-[#0072CE] transition-all"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}