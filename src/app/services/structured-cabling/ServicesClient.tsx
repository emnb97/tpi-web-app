"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Zap, Shield, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundWires from "../../components/BackgroundWires";
import CartSidebar from "../../components/CartSidebar";
import { getSiteContent, getServices } from "../../actions/admin";

interface Service {
  id: number;
  title: string;
  sub: string;
  description: string;
  benefits: string[];
  image: string;
  color: string;
  sort_order: number;
  visible: boolean;
}

export default function ServicesClient() {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      const [cmsData, servicesData] = await Promise.all([getSiteContent(), getServices()]);
      const mapping = cmsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.content }), {});
      setCms(mapping);
      setServices((servicesData as Service[]).filter(s => s.visible !== false));
    }
    loadData();
  }, []);

  if (!mounted) return null;

  const stats = [
    { value: cms['services.stat1.value'] || "100+", label: cms['services.stat1.label'] || "Projects completed" },
    { value: cms['services.stat2.value'] || "5★", label: cms['services.stat2.label'] || "Client satisfaction" },
    { value: cms['services.stat3.value'] || "UK-wide", label: cms['services.stat3.label'] || "Coverage" },
    { value: cms['services.stat4.value'] || "BS EN", label: cms['services.stat4.label'] || "Standards compliant" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white bg-[#F8FAFC] overflow-x-hidden">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 flex-grow mb-[75vh]">

        {/* HERO */}
        <section className="min-h-[80vh] flex items-center px-8 max-w-[1400px] mx-auto pt-56 pb-24">
          <div className="grid grid-cols-12 gap-12 w-full items-center">
            <div className="col-span-12 lg:col-span-6">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs">{cms['services.hero.tag'] || "Site Solutions"}</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-7xl md:text-[100px] font-black italic tracking-tighter text-[#002D72] mt-6 leading-none uppercase font-genos">
                {cms['services.hero.title1'] || "Tier 1"}<br /><span className="text-[#0072CE]">{cms['services.hero.title2'] || "Infrastructure."}</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-medium leading-relaxed mt-10 max-w-lg">
                {cms['services.hero.description'] || "Professional structured cabling and network infrastructure installation across the UK. From single-floor office builds to large-scale MDU fibre roll-outs."}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-4 mt-12">
                <Link href="/#contact">
                  <button className="bg-[#002D72] text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#0072CE] transition-all shadow-xl flex items-center gap-3">Request a quote <ArrowRight size={14} /></button>
                </Link>
                <Link href="/courses">
                  <button className="bg-white border border-slate-200 text-[#002D72] px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:border-[#0072CE] transition-all shadow-sm">Our training</button>
                </Link>
              </motion.div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative aspect-square rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl bg-white">
              <Image src={cms['services.hero.image'] || "/image1.png"} alt="TPI structured cabling installation" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-slate-100 relative z-10">
          <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-black italic text-[#002D72] tracking-tighter">{stat.value}</p>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICE CARDS */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="mb-16 font-genos">
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm">{cms['services.cards.tag'] || "What we install"}</span>
            <motion.h2 whileHover={{ textShadow: "0px 0px 30px rgba(0,45,114,0.6)" }} className="text-6xl font-black text-[#002D72] mt-4 tracking-tighter italic transition-all duration-300">{cms['services.cards.title'] || "Our installation services"}</motion.h2>
          </div>
          <div className="grid grid-cols-12 gap-8">
            {services.map((svc, i) => (
              <motion.div key={svc.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="col-span-12 lg:col-span-6 group">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden hover:border-[#0072CE]/30 transition-all h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={svc.image} alt={svc.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    <div className="absolute bottom-8 left-8">
                      <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white" style={{ backgroundColor: svc.color }}>{svc.sub}</span>
                    </div>
                  </div>
                  <div className="p-12 flex flex-col flex-grow font-genos">
                    <h3 className="text-4xl font-black italic text-[#002D72] leading-none mb-4">{svc.title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8 text-proper">{svc.description}</p>
                    <div className="space-y-3 mb-10 flex-grow">
                      {(svc.benefits || []).map((b: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-slate-500 font-medium italic"><CheckCircle2 size={16} className="text-[#00A651] shrink-0" /> {b}</div>
                      ))}
                    </div>
                    <Link href="/#contact">
                      <button className="w-full border-2 border-[#002D72] text-[#002D72] py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-[#002D72] hover:text-white transition-all">Get a quote</button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY TPI FOR INSTALLATIONS */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-[#002D72] rounded-[5rem] p-16 md:p-24 relative overflow-hidden text-white font-genos">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"><Zap size={400} className="text-white absolute -right-20 -top-20" /></div>
            <div className="relative z-10 grid grid-cols-12 gap-12 items-center">
              <div className="col-span-12 lg:col-span-6 text-proper">
                <span className="text-[#00A651] font-black uppercase tracking-widest text-xs">{cms['services.why.tag'] || "Why choose TPI"}</span>
                <h2 className="text-6xl font-black italic tracking-tighter leading-[0.8] mt-6 mb-12 uppercase">{cms['services.why.title'] || "Site-ready. Standards-led."}</h2>
                <div className="space-y-8">
                  <div className="flex gap-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Shield className="text-[#0072CE]" /></div><div><h4 className="text-2xl font-black italic uppercase">{cms['services.why.point1.title'] || "Fully Compliant"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-lg">{cms['services.why.point1.desc'] || "Every installation meets BS EN 50085, BS EN 61537, and TIA-568 standards as standard."}</p></div></div>
                  <div className="flex gap-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Zap className="text-[#00A651]" /></div><div><h4 className="text-2xl font-black italic uppercase">{cms['services.why.point2.title'] || "Tested & Certified"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-lg">{cms['services.why.point2.desc'] || "Full FLUKE and OTDR testing with certification reports handed over on completion."}</p></div></div>
                  <div className="flex gap-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><MapPin className="text-orange-400" /></div><div><h4 className="text-2xl font-black italic uppercase">{cms['services.why.point3.title'] || "UK-Wide Coverage"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-lg">{cms['services.why.point3.desc'] || "Based in London, operating nationwide on commercial, residential, and data centre projects."}</p></div></div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-6">
                {["/image2.png", "/image3.png", "/image4.png", "/image5.png"].map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/5">
                    <Image src={src} alt={`TPI installation ${i + 1}`} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-16 md:p-24 text-center font-genos">
            <span className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs">{cms['services.cta.tag'] || "Ready to build?"}</span>
            <h2 className="text-6xl md:text-8xl font-black italic text-[#002D72] tracking-tighter leading-none mt-6 mb-8 uppercase">{cms['services.cta.title'] || "Let's talk."}</h2>
            <p className="text-slate-500 text-xl max-w-xl mx-auto leading-relaxed mb-12">{cms['services.cta.description'] || "Tell us about your project and we'll get back to you with a detailed quote within 24 hours."}</p>
            <Link href="/#contact">
              <button className="bg-[#002D72] text-white px-20 py-8 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-[#0072CE] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-4 mx-auto">Request a project quote <ArrowRight size={18} /></button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; overflow-x: hidden; }
        .text-proper { text-transform: none; }
      `}</style>
    </div>
  );
}
