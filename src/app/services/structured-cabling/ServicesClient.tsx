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
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [cmsData, servicesData] = await Promise.all([getSiteContent(), getServices()]);
        const mapping = cmsData.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.content }), {});
        setCms(mapping);
        const filtered = (servicesData as Service[]).filter(s => s.visible !== false);
        
        if (filtered.length > 0) {
          setServices(filtered);
        } else {
          // Fallback: if no services in database, use defaults
          setServices([
            {
              id: 1, title: "Copper Cabling", sub: "Cat5e / Cat6 / Cat6a",
              description: "Full copper structured cabling installations for commercial offices, data centres, and residential developments. From containment and first fix through to termination, testing, and handover.",
              benefits: ["Cat5e, Cat6, and Cat6a installations", "Patch panel termination & labelling", "FLUKE DSX tested & certified", "Floor boxes, faceplates & outlets"],
              image: "/image1.png", color: "#0072CE", sort_order: 1, visible: true,
            },
            {
              id: 2, title: "Fibre Optic", sub: "Single-mode / Multi-mode",
              description: "End-to-end fibre optic infrastructure including backbone cabling, fusion splicing, OTDR testing, and full certification.",
              benefits: ["Single-mode & multi-mode fibre", "Fusion splicing & mechanical splicing", "OTDR testing with full reports", "LC, SC, and MPO connectivity"],
              image: "/image2.png", color: "#00A651", sort_order: 2, visible: true,
            },
            {
              id: 3, title: "Containment", sub: "Trunking / Basket / Conduit",
              description: "Professional cable containment systems including basket tray, ladder rack, trunking, and conduit installation.",
              benefits: ["Cable basket & ladder rack", "PVC & steel trunking", "Conduit & flexible systems", "Fire stopping & labelling"],
              image: "/image3.png", color: "#002D72", sort_order: 3, visible: true,
            },
            {
              id: 4, title: "Network Infrastructure", sub: "Comms rooms / Cabinets",
              description: "Complete comms room fit-outs, cabinet installations, and network infrastructure builds.",
              benefits: ["Server cabinet & rack installation", "PDU & power distribution", "Cable management & dressing", "Full commissioning & handover"],
              image: "/image4.png", color: "#F59E0B", sort_order: 4, visible: true,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setCmsLoaded(true);
      }
    }
    loadData();
  }, []);

  // Show loading state until both mounted and CMS loaded
  if (!mounted || !cmsLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#002D72]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#0072CE] rounded-full animate-spin" />
          </div>
          <p className="text-[#002D72] font-bold text-sm uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  const stats = [
    { value: cms['services.stat1.value'] || "100%", label: cms['services.stat1.label'] || "Client satisfaction" },
    { value: cms['services.stat2.value'] || "5★", label: cms['services.stat2.label'] || "Reviews online" },
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
        <section className="min-h-[80vh] flex items-center px-4 md:px-8 max-w-[1400px] mx-auto pt-32 md:pt-56 pb-16 md:pb-24">
          <div className="grid grid-cols-12 gap-8 md:gap-12 w-full items-center">
            <div className="col-span-12 lg:col-span-6">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A651] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs">{cms['services.hero.tag'] || "Site Solutions"}</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-[100px] font-black italic tracking-tight md:tracking-tighter text-[#002D72] mt-4 md:mt-6 leading-none uppercase font-genos">
                {cms['services.hero.title1'] || "Tier 1"}<br /><span className="text-[#0072CE]">{cms['services.hero.title2'] || "Infrastructure."}</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mt-6 md:mt-10 max-w-lg">
                {cms['services.hero.description'] || "Professional structured cabling and network infrastructure installation across the UK. From single-floor office builds to large-scale MDU fibre roll-outs."}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12">
                <Link href="/#contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-[#002D72] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#0072CE] transition-all shadow-xl flex items-center justify-center gap-3">Request a quote <ArrowRight size={14} /></button>
                </Link>
                <Link href="/courses" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white border border-slate-200 text-[#002D72] px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] md:tracking-[0.3em] hover:border-[#0072CE] transition-all shadow-sm">Our training</button>
                </Link>
              </motion.div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl bg-white mt-8 lg:mt-0">
              <Image src={cms['services.hero.image'] || "/image1.png"} alt="TPI structured cabling installation" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-12 md:py-16 bg-white/50 backdrop-blur-sm border-y border-slate-100 relative z-10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-black italic text-[#002D72] tracking-tighter">{stat.value}</p>
                <p className="text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICE CARDS */}
        <section className="py-16 md:py-32 px-4 md:px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="mb-12 md:mb-16 font-genos">
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-xs md:text-sm">{cms['services.cards.tag'] || "What we install"}</span>
            <motion.h2 whileHover={{ textShadow: "0px 0px 30px rgba(0,45,114,0.6)" }} className="text-4xl md:text-6xl font-black text-[#002D72] mt-2 md:mt-4 tracking-tight md:tracking-tighter italic transition-all duration-300">{cms['services.cards.title'] || "Our installation services"}</motion.h2>
          </div>
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {services.map((svc, i) => (
              <motion.div key={svc.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="col-span-12 lg:col-span-6 group">
                <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden hover:border-[#0072CE]/30 transition-all h-full flex flex-col">
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <Image src={svc.image} alt={svc.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-4 py-1.5 rounded-full text-white" style={{ backgroundColor: svc.color }}>{svc.sub}</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-12 flex flex-col flex-grow font-genos">
                    <h3 className="text-3xl md:text-4xl font-black italic text-[#002D72] leading-none mb-3 md:mb-4">{svc.title}</h3>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8 text-proper">{svc.description}</p>
                    <div className="space-y-3 mb-8 md:mb-10 flex-grow">
                      {(svc.benefits || []).map((b: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-slate-500 font-medium italic text-sm md:text-base"><CheckCircle2 size={16} className="text-[#00A651] shrink-0" /> {b}</div>
                      ))}
                    </div>
                    <Link href="/#contact">
                      <button className="w-full border-2 border-[#002D72] text-[#002D72] py-4 md:py-5 rounded-[2rem] md:rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-[#002D72] hover:text-white transition-all">Get a quote</button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY TPI FOR INSTALLATIONS */}
        <section className="py-16 md:py-32 px-4 md:px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-[#002D72] rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-16 lg:p-24 relative overflow-hidden text-white font-genos">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"><Zap size={400} className="text-white absolute -right-10 md:-right-20 -top-10 md:-top-20" /></div>
            <div className="relative z-10 grid grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="col-span-12 lg:col-span-6 text-proper">
                <span className="text-[#00A651] font-black uppercase tracking-widest text-[10px] md:text-xs">{cms['services.why.tag'] || "Why choose TPI"}</span>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tight md:tracking-tighter leading-[0.8] mt-4 md:mt-6 mb-8 md:mb-12 uppercase">{cms['services.why.title'] || "Site-ready. Standards-led."}</h2>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4 md:gap-6"><div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"><Shield className="text-[#0072CE]" size={20} /></div><div><h4 className="text-xl md:text-2xl font-black italic uppercase">{cms['services.why.point1.title'] || "Fully Compliant"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-base md:text-lg">{cms['services.why.point1.desc'] || "Every installation meets BS EN 50085, BS EN 61537, and TIA-568 standards as standard."}</p></div></div>
                  <div className="flex gap-4 md:gap-6"><div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"><Zap className="text-[#00A651]" size={20} /></div><div><h4 className="text-xl md:text-2xl font-black italic uppercase">{cms['services.why.point2.title'] || "Tested & Certified"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-base md:text-lg">{cms['services.why.point2.desc'] || "Full FLUKE and OTDR testing with certification reports handed over on completion."}</p></div></div>
                  <div className="flex gap-4 md:gap-6"><div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"><MapPin className="text-orange-400" size={20} /></div><div><h4 className="text-xl md:text-2xl font-black italic uppercase">{cms['services.why.point3.title'] || "UK-Wide Coverage"}</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-base md:text-lg">{cms['services.why.point3.desc'] || "Based in London, operating nationwide on commercial, residential, and data centre projects."}</p></div></div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6">
                {["/image2.png", "/image3.png", "/image4.png", "/image5.png"].map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-white/5">
                    <Image src={src} alt={`TPI installation ${i + 1}`} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-2xl p-8 md:p-16 lg:p-24 text-center font-genos">
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs">{cms['services.cta.tag'] || "Ready to build?"}</span>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-black italic text-[#002D72] tracking-tight md:tracking-tighter leading-none mt-4 md:mt-6 mb-6 md:mb-8 uppercase">{cms['services.cta.title'] || "Let's talk."}</h2>
            <p className="text-slate-500 text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-8 md:mb-12">{cms['services.cta.description'] || "Tell us about your project and we'll get back to you with a detailed quote within 24 hours."}</p>
            <Link href="/#contact">
              <button className="w-full sm:w-auto bg-[#002D72] text-white px-10 md:px-20 py-5 md:py-8 rounded-full font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#0072CE] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 md:gap-4 mx-auto">Request a project quote <ArrowRight size={16} /></button>
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