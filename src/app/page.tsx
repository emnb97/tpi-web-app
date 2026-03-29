"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar, Instagram, Mail, ChevronDown, Plus, Minus, Phone } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundWires from "./components/BackgroundWires";
import CartSidebar from "./components/CartSidebar";
import { getSiteContent } from "./actions/admin";

// TikTok Icon Component
const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Accordion Service Item
interface ServiceAccordionProps {
  title: string;
  desc: string;
  fullDesc: string;
  imageSrc: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const ServiceAccordion = ({ title, desc, fullDesc, imageSrc, isOpen, onToggle, index }: ServiceAccordionProps) => {
  const colors = ["#0072CE", "#00A651", "#002D72", "#39B54A", "#8DC63F"];
  const color = colors[index % colors.length];
  
  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
        isOpen 
          ? "bg-white border-slate-200 shadow-2xl shadow-slate-200/50" 
          : "bg-white/60 backdrop-blur-sm border-slate-100 hover:border-slate-200 hover:shadow-lg"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-8 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-6">
          <div 
            className="w-3 h-12 rounded-full transition-all duration-300"
            style={{ backgroundColor: color, opacity: isOpen ? 1 : 0.4 }}
          />
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#002D72] tracking-tight italic capitalize transition-colors">
              {title}
            </h3>
            {!isOpen && (
              <p className="text-slate-500 mt-1 font-medium">{desc}</p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors"
        >
          {isOpen ? <Minus size={20} className="text-[#002D72]" /> : <Plus size={20} className="text-[#002D72]" />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-6">
                <p className="text-xl text-slate-600 leading-relaxed mb-8">{fullDesc}</p>
                <Link href="/contact">
                  <button 
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    style={{ backgroundColor: color, color: "white" }}
                  >
                    Learn more <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image 
                    src={imageSrc} 
                    alt={title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Parallax Course Card
interface ParallaxCourseProps {
  number: number;
  title: string;
  description: string;
  image: string;
  offset: number;
}

const ParallaxCourse = ({ number, title, description, image, offset }: ParallaxCourseProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative"
    >
      <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group cursor-pointer">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002D72] via-[#002D72]/60 to-transparent" />
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <span className="text-[120px] font-black text-white/10 absolute top-4 right-6 leading-none">
            {number}
          </span>
          <div className="relative z-10">
            <span className="text-[#00A651] font-black uppercase text-xs tracking-[0.3em] mb-2 block">
              Course {number}
            </span>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight mb-3">
              {title}
            </h3>
            <p className="text-white/70 leading-relaxed mb-6 max-w-xs">
              {description}
            </p>
            <Link href="/courses">
              <button className="bg-white text-[#002D72] px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#00A651] hover:text-white transition-all">
                View details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animated Header Component
const AnimatedHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const actionVideoRef = useRef<HTMLVideoElement>(null);
  const masterCraftRef = useRef<HTMLDivElement>(null);

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

    const observerOptions = { threshold: 0.3 };
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    if (heroVideoRef.current) observer.observe(heroVideoRef.current);
    if (actionVideoRef.current) observer.observe(actionVideoRef.current);
    return () => observer.disconnect();
  }, []);

  // Show loading state until both mounted and CMS loaded
  if (!mounted || !cmsLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
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

  const services = [
    {
      title: "Structured cabling training",
      desc: "Hands-on theory covering copper and fibre cabling.",
      fullDesc: "Comprehensive training covering installation standards, tools, testing, and best practices for real-world site work. Master the art of copper and fibre termination with industry-leading instructors.",
      imageSrc: "/image1.png"
    },
    {
      title: "ECS support",
      desc: "Guidance for H&S tests and card applications.",
      fullDesc: "Step-by-step support for ECS Health & Safety test preparation and understanding career pathways through formal certification. We guide you through every stage of the process.",
      imageSrc: "/image2.png"
    },
    {
      title: "Practical skills",
      desc: "Termination, testing, and site containment.",
      fullDesc: "Practical learning focused on cable termination, testing, and containment systems like tray, trunking, and conduit. Get hands-on experience with real industry equipment.",
      imageSrc: "/image3.png"
    },
    {
      title: "Career pathways",
      desc: "Routes into data cabling and data centres.",
      fullDesc: "Clear progression routes into data cabling roles, field engineer positions, and data centre environments. We connect you with employers and opportunities.",
      imageSrc: "/image4.png"
    },
    {
      title: "Mentorship",
      desc: "Ongoing guidance and site-readiness.",
      fullDesc: "Continued access to trainer guidance, skill refreshers, and industry-readiness advice for our alumni. Your journey doesn't end when training finishes.",
      imageSrc: "/image5.png"
    }
  ];

  const courses = [
    {
      number: 1,
      title: "Foundation",
      description: "Start your journey with the fundamentals of structured cabling and network infrastructure.",
      image: "/course1.png"
    },
    {
      number: 2,
      title: "Advanced",
      description: "Master complex installations, fibre optics, and data centre environments.",
      image: "/course2.png"
    },
    {
      number: 3,
      title: "Professional",
      description: "Industry certification and placement support for career-ready graduates.",
      image: "/course3.png"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white overflow-x-hidden bg-[#FAFBFC]">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 flex-grow mb-[75vh] bg-transparent">
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-8 max-w-[1400px] mx-auto pt-56 pb-12">
          <div className="grid grid-cols-12 gap-12 w-full items-center">
            <div className="col-span-12 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-7xl md:text-[115px] font-black leading-[0.9] tracking-tighter">
                  <motion.div 
                    whileHover={{ textShadow: "0px 0px 40px rgba(0,114,206,0.5)" }} 
                    className="mb-2 text-[#0072CE] cursor-default transition-all duration-300"
                  >
                    {cms['home.hero.title1'] || "The"}
                  </motion.div>
                  <motion.div 
                    whileHover={{ textShadow: "0px 0px 40px rgba(0,45,114,0.5)" }} 
                    className="mb-2 text-[#002D72] cursor-default transition-all duration-300"
                  >
                    {cms['home.hero.title2'] || "Physical"}
                  </motion.div>
                  <motion.div 
                    whileHover={{ textShadow: "0px 0px 40px rgba(0,166,81,0.5)" }} 
                    className="text-[#00A651] italic cursor-default transition-all duration-300"
                  >
                    {cms['home.hero.title3'] || "Internet"}
                  </motion.div>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 max-w-xl border-l-4 border-[#39B54A] pl-8"
              >
                <p className="text-3xl text-[#002D72] font-black italic mb-4 font-genos tracking-tight uppercase">
                  {cms['home.hero.subtitle'] || "Start your journey, build real skills, stay connected."}
                </p>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  {cms['home.hero.description'] || "We are a structured cabling company that specialises in network infrastructure and data centre services. Everything you do on the internet runs through copper and fibre cables that TPI works to maintain and install."}
                </p>
                <Link href="/courses">
                  <button className="mt-8 bg-[#002D72] text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#39B54A] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-3 group">
                    Explore our mission 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="col-span-12 lg:col-span-5 relative group overflow-hidden rounded-[4rem] shadow-2xl border-[1px] border-slate-200 bg-white"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                transition={{ duration: 0.8, ease: "circOut" }} 
                className="relative w-full aspect-[4/5] overflow-hidden rounded-[3.8rem]"
              >
                <video autoPlay 
                  ref={heroVideoRef} 
                  loop 
                  muted 
                  playsInline 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000"
                >
                  <source src={cms['home.hero.video'] || "/tpihero.mp4"} type="video/mp4" />
                </video>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES ACCORDION */}
        <section id="services" className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="mb-16 font-genos">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm"
            >
              {cms['home.services.tag'] || "How we can help you"}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ textShadow: "0px 0px 40px rgba(0,45,114,0.4)" }}
              className="text-5xl md:text-7xl font-black text-[#002D72] mt-4 tracking-tighter italic transition-all duration-300"
            >
              {cms['home.services.title'] || "Our core services"}
            </motion.h2>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <ServiceAccordion
                key={service.title}
                {...service}
                index={index}
                isOpen={openAccordion === index}
                onToggle={() => setOpenAccordion(openAccordion === index ? null : index)}
              />
            ))}
          </div>
        </section>

        {/* MASTER THE CRAFT - ANIMATED HEADER */}
        <section className="py-16 md:py-32 relative z-20 bg-[#FAFBFC]">
          <div ref={masterCraftRef} className="max-w-[1400px] mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10 md:mb-16"
            >
              <span className="text-[#00A651] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-4 block font-genos">
                {cms['home.action.tag'] || "Master the craft"}
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-[#002D72] tracking-tighter italic">
                {cms['home.action.title1'] || "Training"}{" "}
                <span className="text-[#0072CE]">{cms['home.action.title2'] || "In action"}</span>
              </h2>
            </motion.div>

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-200 bg-slate-900 max-w-5xl mx-auto overflow-hidden"
            >
              <div className="relative aspect-video">
                <video  
                  ref={actionVideoRef} 
                  autoPlay
                  loop 
                  muted 
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={cms['home.action.video'] || "/tpiaction.mp4"} type="video/mp4" />
                </video>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* COURSES - PARALLAX SPLIT */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="mb-16 text-center font-genos">
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm">Our programmes</span>
            <h2 className="text-5xl md:text-7xl font-black text-[#002D72] mt-4 tracking-tighter italic">
              Course pathways
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <ParallaxCourse
                key={course.number}
                {...course}
                offset={index === 1 ? 30 : index === 0 ? 60 : 45}
              />
            ))}
          </div>
        </section>

        {/* PROPER PLANNING QUOTE */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <AnimatedHeader className="text-center">
            <motion.h2 
              whileHover={{ textShadow: "0px 0px 60px rgba(0,45,114,0.25)" }} 
              className="text-5xl md:text-8xl font-black text-[#002D72] tracking-tighter italic leading-none uppercase transition-all duration-500"
            >
              {cms['home.planning.quote'] || "Proper Planning Prevents Poor Performance"}
            </motion.h2>
          </AnimatedHeader>
        </section>

        {/* GET INVOLVED - MAP SECTION */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden font-genos">
            <div className="p-12 border-b border-slate-50 flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-10">
                <div className="relative w-32 h-32 group [perspective:2000px] z-50">
                  <div className="relative w-full h-full transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <Image src="/tpilogo.png" alt="TPI" fill className="object-contain" sizes="128px" />
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <Image src="/tpilogo2.png" alt="TPI" fill className="object-contain" sizes="128px" />
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-[#002D72] tracking-tight italic">
                  {cms['home.event.title'] || "Get involved with TPI"}
                </h2>
              </div>
              <div className="bg-[#00A651]/10 text-[#00A651] px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest">
                Upcoming event
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-12 lg:col-span-5 p-12 bg-[#002D72] text-white">
                <div className="flex items-center gap-2 text-[#00A651] font-black uppercase text-xs tracking-[0.3em] mb-4">
                  <Calendar size={16} /> 2026 Season
                </div>
                <motion.h3 
                  whileHover={{ textShadow: "0px 0px 30px rgba(0,166,81,0.8)" }} 
                  className="text-5xl font-black italic tracking-tighter mb-8 leading-none text-[#00A651] cursor-default transition-all duration-300"
                >
                  {cms['home.event.subtitle1'] || "London"} <br /> 
                  {cms['home.event.subtitle2'] || "Networking"} <br /> 
                  {cms['home.event.subtitle3'] || "Session"}
                </motion.h3>
                <p className="text-xl text-slate-300 leading-relaxed mb-8">
                  {cms['home.event.description'] || "Join the TPI team in central London. A day dedicated to physical infrastructure, networking, and technical community growth."}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest bg-white/10 p-4 rounded-2xl border border-white/5">
                    <MapPin className="text-[#00A651]" /> Central London
                  </div>
                </div>
                <Link href="/contact">
                  <button className="w-full bg-white text-[#002D72] py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#00A651] hover:text-white transition-all shadow-xl">
                    Register interest
                  </button>
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-7 h-[600px] relative grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47340003058!2d-0.24168147910967396!3d51.52855824174697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  title="TPI London location" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-32 px-8 max-w-[1400px] mx-auto relative z-10">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-12 md:p-20 text-center max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black text-[#002D72] italic uppercase tracking-tighter mb-8 leading-none font-genos">
                {cms['home.contact.title1'] || "Get connected"} <br /> 
                {cms['home.contact.title2'] || "with TPI"}
              </h2>
              <p className="text-xl text-slate-500 mb-12 leading-relaxed">
                Ready to start your journey in data cabling? Get in touch with our team today.
              </p>

              {/* Contact Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                <a 
                  href="mailto:e.osobu@thephysicalinternet.uk" 
                  className="flex items-center gap-3 text-[#002D72] font-bold hover:text-[#0072CE] transition-colors"
                >
                  <Mail size={20} />
                  e.osobu@thephysicalinternet.uk
                </a>
                <a 
                  href="tel:07487361240" 
                  className="flex items-center gap-3 text-[#002D72] font-bold hover:text-[#0072CE] transition-colors"
                >
                  <Phone size={20} />
                  07487 361 240
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <a
                  href={cms['footer.instagram'] || "https://www.instagram.com/thephysicalinternet"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-100 rounded-2xl hover:bg-[#E4405F] hover:text-white transition-all group"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href={cms['footer.tiktok'] || "https://www.tiktok.com/@manny_tpi"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-100 rounded-2xl hover:bg-black hover:text-white transition-all group"
                >
                  <TikTokIcon size={24} />
                </a>
              </div>

              {/* CTA Button */}
              <Link href="/contact">
                <button className="bg-[#002D72] text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-[#0072CE] transition-all shadow-xl shadow-blue-900/10 inline-flex items-center gap-3 group">
                  Contact us
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; overflow-x: hidden; }
        .text-proper { text-transform: none; }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}