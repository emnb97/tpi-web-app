"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";
import { getSiteContent } from "../actions/admin";

// Animated section wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Image Box Component with hover effects
const ImageBox = ({ 
  src, 
  alt, 
  title, 
  overlay = true, 
  className = "",
  aspectRatio = "aspect-square"
}: { 
  src: string; 
  alt: string; 
  title?: string; 
  overlay?: boolean;
  className?: string;
  aspectRatio?: string;
}) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={`relative ${aspectRatio} rounded-[2rem] overflow-hidden group cursor-pointer ${className}`}
  >
    <Image 
      src={src} 
      alt={alt} 
      fill 
      className="object-cover transition-transform duration-700 group-hover:scale-110" 
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    {overlay && (
      <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/90 via-[#002D72]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )}
    {title && (
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h4 className="text-white font-black uppercase tracking-tight text-lg italic">{title}</h4>
      </div>
    )}
  </motion.div>
);

export default function AboutClient() {
  const [mounted, setMounted] = useState(false);
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    async function loadCms() {
      try {
        const data = await getSiteContent();
        const mapping = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.content }), {});
        setCms(mapping);
      } catch (error) {
        console.error('Failed to load CMS:', error);
      } finally {
        setCmsLoaded(true);
      }
    }
    loadCms();
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

  const pillars = [
    { 
      title: cms['about.pillar1.title'] || "Practical first", 
      desc: cms['about.pillar1.desc'] || "Every course is built around real tools, real site conditions, and real outcomes — not just theory in a classroom.", 
      color: "#0072CE",
      icon: "🔧"
    },
    { 
      title: cms['about.pillar2.title'] || "Career ready", 
      desc: cms['about.pillar2.desc'] || "We don't just teach; we open doors. From ECS cards to employer introductions, TPI gets you site-ready.", 
      color: "#00A651",
      icon: "🎯"
    },
    { 
      title: cms['about.pillar3.title'] || "Community", 
      desc: cms['about.pillar3.desc'] || "The TPI network is a lifelong connection to peers, mentors, and industry professionals across the UK.", 
      color: "#002D72",
      icon: "🤝"
    },
  ];

  // Gallery images - these would come from CMS in production
  const galleryImages = [
    { src: cms['about.gallery.image1'] || "/training1.jpg", alt: "TPI Training Session", title: "Hands-on Training" },
    { src: cms['about.gallery.image2'] || "/training2.jpg", alt: "Data Cabling Work", title: "Real-world Skills" },
    { src: cms['about.gallery.image3'] || "/training3.jpg", alt: "TPI Team", title: "Expert Instructors" },
    { src: cms['about.gallery.image4'] || "/training4.jpg", alt: "Cable Installation", title: "Industry Standards" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white overflow-x-hidden bg-white">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="bg-white min-h-screen pt-48 px-8 font-genos relative z-10 flex-grow mb-[75vh]">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Hero Section */}
          <AnimatedSection>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm"
            >
              {cms['about.hero.tag'] || "Our Story"}
            </motion.span>

            <div className="grid grid-cols-12 gap-12 mt-8">
              <div className="col-span-12 lg:col-span-7">
                <h1 className="text-7xl md:text-9xl font-black text-[#002D72] leading-[0.8] uppercase tracking-tighter">
                  {(cms['about.hero.title'] || "Guarding the Pulse of the World.").split(' ').map((word, i, arr) => {
                    if (word.toLowerCase() === 'pulse') return <span key={i}><span className="text-[#00A651] italic">{word}</span>{' '}</span>;
                    if (i === Math.floor(arr.length / 2)) return <span key={i}><br />{word}{' '}</span>;
                    return <span key={i}>{word}{' '}</span>;
                  })}
                </h1>
              </div>
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
                <p className="text-2xl text-slate-500 font-medium leading-relaxed">
                  {cms['about.hero.description'] || "Every upload, every download, and every digital connection runs through the copper and fibre cables that TPI technicians install and maintain. We are the backbone of the digital age."}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Image Gallery Section */}
          <AnimatedSection className="py-24">
            <div className="grid grid-cols-12 gap-6">
              {/* Large featured image */}
              <div className="col-span-12 md:col-span-8">
                <ImageBox 
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  title={galleryImages[0].title}
                  aspectRatio="aspect-[16/10]"
                />
              </div>
              {/* Stacked smaller images */}
              <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
                <ImageBox 
                  src={galleryImages[1].src}
                  alt={galleryImages[1].alt}
                  title={galleryImages[1].title}
                  aspectRatio="aspect-[4/3]"
                />
                <ImageBox 
                  src={galleryImages[2].src}
                  alt={galleryImages[2].alt}
                  title={galleryImages[2].title}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
            </div>
            {/* Second row - asymmetric */}
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="col-span-12 md:col-span-5">
                <ImageBox 
                  src={galleryImages[3].src}
                  alt={galleryImages[3].alt}
                  title={galleryImages[3].title}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
              <div className="col-span-12 md:col-span-7 bg-[#002D72] rounded-[2rem] p-10 flex flex-col justify-center">
                <p className="text-white/60 uppercase tracking-[0.3em] text-xs font-bold mb-4">Our mission</p>
                <p className="text-white text-2xl md:text-3xl font-medium leading-relaxed italic">
                  {cms['about.gallery.quote'] || "To train, equip, and launch the next generation of data cabling professionals into the UK workforce."}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Narrative Section */}
          <AnimatedSection className="py-32 grid grid-cols-12 gap-12 border-t border-slate-100">
            <div className="col-span-12 md:col-span-6">
              <h2 className="text-[#002D72] text-4xl font-black uppercase italic mb-8">
                {cms['about.narrative.title'] || "What is the data cabling industry?"}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-6">
                {cms['about.narrative.para1'] || "Everything you do on the internet—that new Netflix show, that game download, that online booking—all runs through the physical infrastructure we build."}
              </p>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                {cms['about.narrative.para2'] || "Data cabling engineers are the unsung architects of modern connectivity. TPI exists to train, equip, and launch the next generation of these essential professionals into the UK workforce."}
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-[#002D72] text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-[#0072CE] transition-colors shadow-xl group"
                >
                  Start your journey
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
            <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[3rem] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A651]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0072CE]/10 rounded-full blur-3xl" />
              <p className="text-lg text-slate-600 italic leading-relaxed relative z-10">
                &quot;{cms['about.narrative.quote'] || "TPI provides the practical and theoretical training to give you all the preparation you need to forge a career in the data cabling and data centre industry."}&quot;
              </p>
              <div className="mt-8 pt-8 border-t border-slate-200 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#002D72] rounded-full flex items-center justify-center text-white font-black text-xl">
                    E
                  </div>
                  <div>
                    <p className="text-[#002D72] font-black uppercase text-sm tracking-widest">{cms['about.narrative.quotee'] || "E. Osobu"}</p>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">{cms['about.narrative.quotee_title'] || "Founder, The Physical Internet"}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Stats Section */}
          <AnimatedSection className="py-20 border-t border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: cms['about.stat1.number'] || "500+", label: cms['about.stat1.label'] || "Graduates trained" },
                { number: cms['about.stat2.number'] || "98%", label: cms['about.stat2.label'] || "Employment rate" },
                { number: cms['about.stat3.number'] || "50+", label: cms['about.stat3.label'] || "Industry partners" },
                { number: cms['about.stat4.number'] || "5★", label: cms['about.stat4.label'] || "Student rating" },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-5xl md:text-6xl font-black text-[#002D72] tracking-tighter">{stat.number}</p>
                  <p className="text-slate-500 uppercase tracking-widest text-xs mt-2 font-bold">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Mission pillars */}
          <AnimatedSection className="py-32 border-t border-slate-100">
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm">{cms['about.pillars.tag'] || "What drives us"}</span>
            <h2 className="text-[#002D72] text-5xl font-black uppercase italic mt-4 mb-16">{cms['about.pillars.title'] || "Our mission pillars"}</h2>
            <div className="grid grid-cols-12 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div 
                  key={pillar.title} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="col-span-12 md:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-16 rounded-full transition-all duration-300 group-hover:h-20" style={{ backgroundColor: pillar.color }} />
                    <span className="text-4xl">{pillar.icon}</span>
                  </div>
                  <h3 className="text-3xl font-black text-[#002D72] uppercase italic mb-4 group-hover:text-[#0072CE] transition-colors">{pillar.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className="py-32 border-t border-slate-100">
            <div className="bg-[#002D72] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0072CE]/30 rounded-full blur-[128px]" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00A651]/20 rounded-full blur-[100px]" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">
                  Ready to build <br />
                  <span className="text-[#00A651]">your future?</span>
                </h2>
                <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">
                  Join the TPI community and become part of the essential workforce keeping the digital world connected.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/courses">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-10 py-5 bg-white text-[#002D72] rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-[#00A651] hover:text-white transition-all shadow-xl inline-flex items-center gap-3 group"
                    >
                      View courses
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:border-white hover:bg-white/10 transition-all inline-flex items-center gap-3"
                    >
                      Get in touch
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
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