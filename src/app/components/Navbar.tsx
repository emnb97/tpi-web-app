"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Training & courses", href: "/courses" },
  { label: "Installation services", href: "/services/structured-cabling" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  onCartOpen: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoFlipped, setLogoFlipped] = useState(false);
  const { itemCount } = useCart();
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [100, 300], [1, 0]);
  const pathname = usePathname();

  // Filter out the current page from nav items
  const filteredNavItems = navItems.filter(item => {
    if (item.href === "/" && pathname === "/") return false;
    if (item.href !== "/" && pathname.startsWith(item.href)) return false;
    return true;
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  });

  return (
    <>
      {/* Top-left logo flip — hidden on mobile when hamburger menu is open */}
      <Link href="/" aria-label="The Physical Internet — Home">
        <motion.div
          style={{ opacity: logoOpacity }}
          className={`fixed top-2 left-4 md:left-10 z-[1000] w-28 h-28 md:w-48 md:h-48 cursor-pointer [perspective:2000px] ${
            mobileMenuOpen ? "hidden md:block" : "block"
          }`}
          onMouseEnter={() => setLogoFlipped(true)}
          onMouseLeave={() => setLogoFlipped(false)}
          onTouchStart={(e) => { e.stopPropagation(); setLogoFlipped(f => !f); }}
        >
          <div
            className="relative w-full h-full transition-transform duration-1000 ease-in-out [transform-style:preserve-3d]"
            style={{ transform: logoFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Image src="/tpilogo.png" alt="TPI Logo" fill className="object-contain" priority sizes="(max-width: 768px) 112px, 192px" />
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Image src="/tpilogo2.png" alt="TPI Logo Alt" fill className="object-contain" priority sizes="(max-width: 768px) 112px, 192px" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Mobile hamburger button */}
      <motion.button
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 } }}
        animate={navVisible ? "visible" : "hidden"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-6 right-4 z-[120] md:hidden w-12 h-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-[#002D72]" />
      </motion.button>

      {/* Mobile cart button */}
      <motion.button
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 } }}
        animate={navVisible ? "visible" : "hidden"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onClick={onCartOpen}
        className="fixed top-6 right-[4.5rem] z-[120] md:hidden w-12 h-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center"
        aria-label={`Open cart — ${itemCount} items`}
      >
        <ShoppingCart size={18} className="text-[#002D72]" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#0072CE] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-[#002D72]/95 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={20} className="text-[#002D72]" />
              </button>

              {/* Logo in menu — tap to flip */}
              <div className="pt-20 px-8">
                <div
                  className="relative w-24 h-24 mb-8 [perspective:2000px] cursor-pointer"
                  onTouchStart={() => setLogoFlipped(f => !f)}
                  onClick={() => setLogoFlipped(f => !f)}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-1000 ease-in-out [transform-style:preserve-3d]"
                    style={{ transform: logoFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <Image src="/tpilogo.png" alt="TPI" fill className="object-contain" sizes="96px" />
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <Image src="/tpilogo2.png" alt="TPI Alt" fill className="object-contain" sizes="96px" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <nav className="px-8 space-y-2">
                {filteredNavItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-4 border-b border-slate-100"
                    >
                      <span className="text-lg font-black uppercase tracking-wide text-[#002D72] hover:text-[#0072CE] transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Cart button in menu */}
              <div className="px-8 mt-8">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onCartOpen();
                  }}
                  className="w-full py-4 bg-[#002D72] text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={18} />
                  View Cart
                  {itemCount > 0 && (
                    <span className="bg-[#00A651] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Contact info */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Get in touch</p>
                <a href="mailto:e.osobu@thephysicalinternet.uk" className="text-sm font-bold text-[#002D72] block mb-1">
                  e.osobu@thephysicalinternet.uk
                </a>
                <a href="tel:07487361240" className="text-sm font-bold text-[#002D72]">
                  07487 361 240
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop navigation pill */}
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 } }}
        animate={navVisible ? "visible" : "hidden"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-12 right-12 z-[110] hidden md:block"
        aria-label="Main navigation"
      >
        <div className="flex gap-2 bg-white/80 backdrop-blur-2xl border border-slate-100 px-6 py-3 rounded-full shadow-2xl items-center">
          {filteredNavItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="relative h-6 overflow-hidden group cursor-pointer px-4">
                <motion.div className="flex flex-col transition-all duration-500 ease-in-out group-hover:-translate-y-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#002D72] leading-6 whitespace-nowrap">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0072CE] leading-6 whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.div>
              </div>
            </Link>
          ))}
          <div className="border-l border-slate-200 ml-2 pl-4 flex items-center">
            <button
              onClick={onCartOpen}
              aria-label={`Open cart — ${itemCount} items`}
              className="relative"
            >
              <ShoppingCart size={18} className="text-[#002D72] cursor-pointer hover:text-[#0072CE] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0072CE] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}