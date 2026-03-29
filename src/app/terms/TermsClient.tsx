"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";
import { getSiteContent } from "../actions/admin";

export default function TermsClient() {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    async function loadCms() {
      const data = await getSiteContent();
      const mapping = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.content }), {});
      setCms(mapping);
    }
    loadCms();
  }, []);

  if (!mounted) return null;

  const sectionCount = 8;
  const sections = Array.from({ length: sectionCount }, (_, i) => ({
    title: cms[`terms.section${i + 1}.title`] || `Section ${i + 1}`,
    content: cms[`terms.section${i + 1}.content`] || "",
  })).filter(s => s.content);

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white bg-[#F8FAFC] overflow-x-hidden">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 flex-grow mb-[75vh] pt-48 px-8 max-w-[1400px] mx-auto pb-32">
        <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm font-genos">{cms['terms.hero.tag'] || "Legal"}</span>
        <h1 className="text-7xl md:text-9xl font-black text-[#002D72] leading-[0.85] uppercase tracking-tighter mt-6 mb-4 font-genos">
          Terms &amp; <br />
          <span className="text-[#0072CE] italic">Conditions.</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium mt-6 mb-24 max-w-xl leading-relaxed">{cms['terms.hero.description'] || "Last updated: January 2026. Please read these terms carefully before using TPI's website, enrolling on a course, or making a purchase."}</p>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-12 grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-3">
                <span className="text-[#00A651] font-black uppercase text-xs tracking-widest">0{i + 1}</span>
                <h2 className="text-2xl font-black text-[#002D72] italic uppercase mt-2 leading-tight font-genos">{section.title}</h2>
              </div>
              <div className="col-span-12 md:col-span-9">
                <p className="text-slate-500 text-lg leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; overflow-x: hidden; }
      `}</style>
    </div>
  );
}
