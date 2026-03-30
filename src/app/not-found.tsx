"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, ShoppingBag, GraduationCap, Mail } from "lucide-react";

/* ── Flipping TPI Logo — reusable across the site ───────────────────────────
   Desktop: horizontal flip on hover (CSS group-hover)
   Mobile:  horizontal flip on tap/touch (React state)
   Transparent PNGs — clean 3D card-flip effect.                              */
function FlippingLogo({ size = 192, className = "" }: { size?: number; className?: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
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

/* ── Animated cable background — signature TPI aesthetic ───────────────── */
const CableBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {/* Loose cables — like someone tripped over the patch panel */}
      <motion.path
        d="M-5 15 C 20 15, 35 45, 50 45 S 80 15, 105 15"
        stroke="#0072CE"
        strokeWidth="0.3"
        fill="none"
        strokeOpacity="0.15"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.path
        d="M-5 85 C 25 85, 40 55, 55 55 S 85 85, 105 85"
        stroke="#00A651"
        strokeWidth="0.25"
        fill="none"
        strokeOpacity="0.12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.path
        d="M-5 50 C 15 30, 45 70, 65 50 S 90 30, 105 50"
        stroke="#002D72"
        strokeWidth="0.2"
        fill="none"
        strokeOpacity="0.08"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 5, ease: "easeInOut", delay: 1 }}
      />
      {/* Disconnected cable */}
      <motion.path
        d="M30 95 C 35 80, 40 70, 42 65"
        stroke="#0072CE"
        strokeWidth="0.4"
        fill="none"
        strokeOpacity="0.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
      />
      {/* Another dangling cable */}
      <motion.path
        d="M70 5 C 68 20, 72 35, 65 40"
        stroke="#00A651"
        strokeWidth="0.35"
        fill="none"
        strokeOpacity="0.18"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 2 }}
      />
    </svg>
  </div>
);

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const links = [
    { label: "Home", href: "/", icon: Home, desc: "Back to base" },
    { label: "Training", href: "/courses", icon: GraduationCap, desc: "ECS & cabling courses" },
    { label: "Store", href: "/store", icon: ShoppingBag, desc: "Tools & kit" },
    { label: "Contact", href: "mailto:e.osobu@thephysicalinternet.uk", icon: Mail, desc: "Get in touch" },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 py-20 font-sans selection:bg-[#0072CE] selection:text-white overflow-hidden">
      <CableBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* ── Large flipping logo — prominent and interactive ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <FlippingLogo size={220} className="mb-8" />
        </motion.div>

        {/* ── 404 heading ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs mb-4 block">
            Error 404
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black italic tracking-tighter text-[#002D72] leading-none uppercase font-genos">
            CABLE <span className="text-[#0072CE]">CUT.</span>
          </h1>
        </motion.div>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 md:mt-8 text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md"
        >
          Looks like someone pulled the wrong patch lead. This page doesn&apos;t exist — but the rest of the network is still live.
        </motion.p>

        {/* ── Quick nav cards ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-xl"
        >
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg p-5 md:p-6 text-center hover:border-[#0072CE]/30 hover:shadow-xl transition-all group cursor-pointer">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 rounded-xl bg-[#002D72]/5 flex items-center justify-center group-hover:bg-[#0072CE]/10 transition-colors">
                  <link.icon size={20} className="text-[#002D72] group-hover:text-[#0072CE] transition-colors" />
                </div>
                <p className="text-[#002D72] font-black text-xs uppercase tracking-widest mb-1">
                  {link.label}
                </p>
                <p className="text-slate-400 text-[10px] leading-tight">{link.desc}</p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* ── Main CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10"
        >
          <Link href="/">
            <button className="bg-[#002D72] text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0072CE] transition-all shadow-xl flex items-center gap-3">
              Back to the network <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>

        {/* ── Cheeky footer ────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 text-[11px] text-slate-300 italic"
        >
          &quot;Have you tried turning it off and on again?&quot; — Every IT engineer, ever.
        </motion.p>
      </div>

      <style jsx global>{`
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
}