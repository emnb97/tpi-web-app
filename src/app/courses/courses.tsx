"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, CheckCircle2, Calendar, MapPin, 
  Users, Zap, Shield, ChevronRight, Play, Star,
  ShoppingCart, X
} from "lucide-react";
import CartSidebar from "../components/CartSidebar";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: string; // Updated to string for ££££
  level: string;
  image: string;
  benefits: string[];
  desc: string;
}

const BackgroundWires = () => (
  <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden bg-[#F8FAFC]">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <motion.path d="M-5 20 C 30 20, 70 80, 105 80" stroke="#002D72" strokeWidth="0.2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: "easeInOut" }} />
      <motion.path d="M-5 80 C 40 80, 60 20, 105 20" stroke="#00A651" strokeWidth="0.15" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 6, ease: "easeInOut", delay: 1 }} />
    </svg>
  </div>
);

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // --- REPAIRED: Uniform Nav & Logo Settings ---
  const [navVisible, setNavVisible] = useState(true);
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

  const courses: Course[] = [
    {
      id: 1,
      title: "Become a Data Cabling Expert",
      category: "Masterclass",
      duration: "3-5 Days",
      price: "££££",
      level: "Beginner to Pro",
      image: "/course1.png",
      desc: "The flagship course. From copper termination to fiber splicing, master the physical layer of the internet.",
      benefits: ["Hands-on Fusion Splicing", "Cat6/6a Masterclass", "Testing & Fault Finding", "ECS Test Support"]
    },
    {
      id: 2,
      title: "Fiber Optic Specialization",
      category: "Infrastructure",
      duration: "2 Days",
      price: "££££",
      level: "Intermediate",
      image: "/course2.png",
      desc: "Deep dive into FTTP and MDU builds. Learn single-mode and multi-mode termination for modern data centers.",
      benefits: ["OTDR Testing", "Live Fiber Management", "MDU Build Strategy", "Industry Standards"]
    },
    {
      id: 3,
      title: "Structure Cabling Level 2",
      category: "Certification",
      duration: "5 Days",
      price: "££££",
      level: "Accredited",
      image: "/course3.png",
      desc: "City & Guilds 3668-02 mapped units. Gain the formal recognition needed for major UK construction sites.",
      benefits: ["Official Certification", "H&S Regulations", "Site Containment", "Career Placement Support"]
    }
  ];

  const testimonials = [
    "TPI changed my career trajectory. The practical kits are world-class.",
    "Best fiber training in London. Manny knows his stuff.",
    "From zero to site-ready in 5 days. Incredible experience.",
    "The physical internet is complex, but TPI makes it simple.",
    "Highly recommend for anyone wanting to get into data centres."
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Training & courses", href: "/courses" },
    { label: "Store", href: "/store" }
  ];

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white bg-[#F8FAFC] overflow-x-hidden">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* --- REPAIRED: UNIFORM TOP LEFT LOGO --- */}
      <Link href="/">
        <motion.div 
          style={{ opacity: logoOpacity }}
          className="fixed top-2 left-10 z-[1000] w-48 h-48 cursor-pointer"
        >
          <div className="relative w-full h-full group [perspective:2000px]">
            <div className="relative w-full h-full transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <Image src="/tpilogo.png" alt="TPI" fill className="object-contain" priority sizes="192px" />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Image src="/tpilogo2.png" alt="TPI" fill className="object-contain" priority sizes="192px" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* --- REPAIRED: UNIFORM TOP NAV BAR --- */}
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
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

      <main className="relative z-10 pt-48 pb-32 px-8 max-w-[1400px] mx-auto w-full bg-transparent">
        {/* HERO SECTION */}
        <section className="mb-32 text-center">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[#00A651] font-black uppercase tracking-[0.5em] text-xs">The Training Academy</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-7xl md:text-[110px] font-black italic tracking-tighter text-[#002D72] mt-6 leading-none uppercase">
                BUILD YOUR <br/> <span className="text-[#0072CE]">FUTURE.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto mt-12 text-slate-500 text-xl font-medium leading-relaxed">
                TPI provides the most practical data cabling courses in the UK. We don't just teach theory; we prepare you for the live site. Master the craft, get certified, and join the network.
            </motion.p>
        </section>

        {/* FEATURED COURSE CARDS */}
        <section className="grid grid-cols-12 gap-8 mb-40">
            {courses.map((course, i) => (
                <motion.div 
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="col-span-12 lg:col-span-4 group cursor-pointer"
                    onClick={() => setSelectedCourse(course)}
                >
                    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden h-full flex flex-col hover:border-[#0072CE]/30 transition-all">
                        <div className="relative h-64 overflow-hidden">
                            <Image src={course.image} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#002D72]">{course.level}</div>
                        </div>
                        <div className="p-10 flex flex-col flex-grow font-genos">
                            <span className="text-[#00A651] font-black uppercase tracking-widest text-[10px] mb-2">{course.category}</span>
                            <h3 className="text-4xl font-black italic text-[#002D72] leading-none mb-6 group-hover:text-[#0072CE] transition-colors">{course.title}</h3>
                            
                            <div className="space-y-3 mb-10 flex-grow">
                                {course.benefits.map((b, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-500 font-medium italic"><CheckCircle2 size={16} className="text-[#00A651]"/> {b}</div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                                <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pricing</p><p className="text-2xl font-black text-[#002D72]">{course.price}</p></div>
                                <div className="bg-[#002D72] text-white p-5 rounded-3xl hover:bg-[#0072CE] transition-all shadow-lg"><ArrowRight size={24}/></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </section>

        {/* TESTIMONIALS MARQUEE */}
        <section className="py-24 border-y border-slate-100 bg-white/30 backdrop-blur-sm overflow-hidden mb-40">
           <h2 className="text-center font-genos text-3xl font-black italic text-[#002D72] uppercase tracking-tight mb-12">Kind words from successful connections</h2>
           <div className="flex whitespace-nowrap marquee-track">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 px-6">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg inline-flex flex-col min-w-[400px] font-genos">
                            <div className="flex gap-1 mb-4 text-[#00A651]">{[...Array(5)].map((_, s) => <Star key={s} size={12} fill="#00A651" />)}</div>
                            <p className="text-lg italic font-medium text-[#002D72] whitespace-normal text-proper">"{t}"</p>
                        </div>
                    ))}
                </div>
              ))}
           </div>
        </section>

        {/* UNIFORM CTA BENTO */}
        <section className="px-8 max-w-[1400px] mx-auto mb-40">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-12 font-genos">
            <div className="col-span-12 lg:col-span-7 p-12 md:p-20 border-r border-slate-50 text-proper">
              <h2 className="text-6xl font-black text-[#002D72] italic uppercase tracking-tighter mb-4 leading-none">Submit a Testimonial</h2>
              <p className="text-xl text-slate-400 mb-12">Share your experience with the network.</p>
              <form className="space-y-6">
                <input placeholder="Full Name" className="bg-slate-50 border-none rounded-3xl p-6 text-lg w-full outline-none focus:ring-2 focus:ring-[#0072CE]/20" />
                <textarea placeholder="Your Message" rows={4} className="bg-slate-50 border-none rounded-3xl p-6 text-lg w-full outline-none focus:ring-2 focus:ring-[#0072CE]/20" />
                <button type="button" onClick={() => alert("Signal sent to Matrix for approval.")} className="bg-[#002D72] text-white w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#0072CE] transition-all shadow-xl">Submit to Matrix</button>
              </form>
            </div>
            <div className="col-span-12 lg:col-span-5 p-12 md:p-20 bg-slate-50/50 flex flex-col justify-center items-center text-center">
                <Zap size={64} className="text-[#00A651] mb-6" />
                <h4 className="text-3xl font-black text-[#002D72] italic uppercase leading-tight">Join the <br/> Connection</h4>
                <p className="text-slate-400 mt-4 italic font-medium">Your feedback powers the physical internet.</p>
            </div>
          </div>
        </section>

        {/* WHY TPI SECTION */}
        <section className="bg-[#002D72] rounded-[5rem] p-16 md:p-24 relative overflow-hidden text-white font-genos">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"><Zap size={400} className="text-white absolute -right-20 -top-20" /></div>
            <div className="relative z-10 grid grid-cols-12 gap-12 items-center">
                <div className="col-span-12 lg:col-span-6 text-proper">
                    <span className="text-[#00A651] font-black uppercase tracking-widest text-xs">Industry Standard Training</span>
                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] mt-6 mb-12 uppercase">Why Train <br/> With TPI?</h2>
                    <div className="space-y-8">
                        <div className="flex gap-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Zap className="text-[#00A651]" /></div><div><h4 className="text-2xl font-black italic uppercase">Live Site Gear</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-lg">Work with actual Fusion Splicers, Fluke testers, and industrial cabling kits.</p></div></div>
                        <div className="flex gap-6"><div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Shield className="text-[#0072CE]" /></div><div><h4 className="text-2xl font-black italic uppercase">ECS Certification</h4><p className="text-slate-300 italic mt-1 leading-relaxed text-lg">We provide full guidance on Health & Safety tests and ECS card applications.</p></div></div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6 relative aspect-square rounded-[4rem] overflow-hidden border-8 border-white/5">
                    <Image src="/coursehero.png" alt="In Action" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/60 to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center group"><div className="w-24 h-24 bg-[#00A651] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-[#00A651]/40"><Play size={32} className="fill-white text-white ml-2" /></div></button>
                </div>
            </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#002D72] text-white p-24 font-genos border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12 text-proper">
            <div><h2 className="text-[12vw] md:text-[8vw] font-black italic tracking-tighter leading-[0.8]">Master <br/> The Craft.</h2></div>
            <div className="text-right space-y-4"><p className="text-slate-400 font-black uppercase tracking-widest text-xs">The Physical Internet © 2026</p><Link href="mailto:e.osobu@thephysicalinternet.uk" className="text-4xl font-black italic hover:text-[#00A651] transition-colors uppercase">Apply Now</Link></div>
        </div>
      </footer>

      {/* COURSE DETAIL MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCourse(null)} className="absolute inset-0 bg-[#002D72]/95 backdrop-blur-2xl" />
            <motion.div layoutId={`course-${selectedCourse.id}`} className="relative w-full max-w-5xl bg-white rounded-[4rem] overflow-hidden shadow-2xl grid grid-cols-12 font-genos text-proper">
              <div className="col-span-12 lg:col-span-5 bg-slate-50 relative h-[400px] lg:h-full">
                <Image src={selectedCourse.image} alt={selectedCourse.title} fill className="object-cover grayscale" />
                <div className="absolute inset-0 bg-[#002D72]/20" />
                <button onClick={() => setSelectedCourse(null)} className="absolute top-10 left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><X size={20} className="text-[#002D72]" /></button>
              </div>
              <div className="col-span-12 lg:col-span-7 p-12 md:p-20">
                <span className="text-[#00A651] font-black uppercase tracking-widest text-xs">{selectedCourse.category}</span>
                <h2 className="text-5xl md:text-7xl font-black italic text-[#002D72] mt-4 mb-8 leading-none uppercase">{selectedCourse.title}</h2>
                <div className="flex gap-8 mb-10 text-[#002D72] font-black uppercase text-[10px] tracking-widest">
                    <div className="flex items-center gap-2"><Calendar size={16} /> {selectedCourse.duration}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} /> Central London</div>
                    <div className="flex items-center gap-2 text-[#00A651]"><Star size={16} fill="#00A651" /> Top Rated</div>
                </div>
                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 italic">{selectedCourse.desc}</p>
                <div className="flex items-center gap-10">
                    <div><p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Tuition</p><p className="text-4xl font-black text-[#002D72]">{selectedCourse.price}</p></div>
                    <button className="flex-grow bg-[#002D72] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-[#0072CE] transition-all shadow-xl">Secure Your Space</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        .marquee-track { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .text-proper { text-transform: none; }
      `}</style>
    </div>
  );
}