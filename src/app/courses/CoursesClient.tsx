"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Calendar, MapPin, Zap, Shield, Play, Star, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";
import { getSiteContent, getCourses, getTestimonials } from "../actions/admin";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: string;
  price_note: string;
  level: string;
  image: string;
  benefits: string[];
  description: string;
  visible?: boolean;
}

// Course Box Component (matching home page style)
interface CourseBoxProps {
  number: string;
  title: string;
  description: string;
  image: string;
  offset: number;
  storeLink?: string;
}

const CourseBox = ({ number, title, description, image, offset, storeLink }: CourseBoxProps) => {
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
      <div className="relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group cursor-pointer">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002D72] via-[#002D72]/60 to-transparent" />
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
          <span className="text-[80px] md:text-[120px] font-black text-white/10 absolute top-2 md:top-4 right-4 md:right-6 leading-none">
            {number}
          </span>
          <div className="relative z-10">
            <span className="text-[#00A651] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] mb-2 block">
              Course {number}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight mb-3">
              {title}
            </h3>
            <p className="text-white/70 leading-relaxed mb-6 max-w-xs text-sm md:text-base">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={storeLink || "/store"}>
                <button className="bg-[#00A651] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#008c44] transition-all w-full sm:w-auto">
                  Book now
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-[#002D72] transition-all w-full sm:w-auto">
                  Enquire
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CoursesClient() {
  const [mounted, setMounted] = useState(false);
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [cms, setCms] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [testimonials, setTestimonials] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [cmsData, coursesData, testimonialsData] = await Promise.all([
          getSiteContent(),
          getCourses(),
          getTestimonials()
        ]);
        const mapping = cmsData.reduce((acc: Record<string, string>, curr: { id: string; content: string }) => ({ ...acc, [curr.id]: curr.content }), {});
        setCms(mapping);
        setCourses((coursesData as Course[]).filter((c: Course) => c.visible !== false));
        const approved = (testimonialsData as { status: string; content: string }[]).filter(t => t.status === "Approved").map(t => t.content);
        setTestimonials(approved.length > 0 ? approved : [
          "TPI changed my career trajectory. The practical kits are world-class.",
          "Best fiber training in London. Manny knows his stuff.",
          "From zero to site-ready in 5 days. Incredible experience.",
          "The physical internet is complex, but TPI makes it simple.",
          "Highly recommend for anyone wanting to get into data centres.",
        ]);
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

  // Static course data for the 3 boxes
  const courseBoxes = [
    {
      number: "1",
      title: "Foundation",
      description: "Start your journey in structured cabling. Learn the fundamentals of copper and fibre installation.",
      image: cms['courses.box1.image'] || "/course1.jpg",
      storeLink: "/store#foundation"
    },
    {
      number: "2", 
      title: "Advanced",
      description: "Elevate your skills with advanced termination techniques and testing procedures.",
      image: cms['courses.box2.image'] || "/course2.jpg",
      storeLink: "/store#advanced"
    },
    {
      number: "3",
      title: "Professional",
      description: "Master-level training for data centre environments and complex installations.",
      image: cms['courses.box3.image'] || "/course3.jpg",
      storeLink: "/store#professional"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white bg-[#F8FAFC] overflow-x-hidden">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 pt-36 md:pt-48 pb-32 px-4 md:px-8 max-w-[1400px] mx-auto w-full bg-transparent mb-[75vh]">
        {/* HERO */}
        <section className="mb-16 md:mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[#00A651] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs"
          >
            {cms['courses.hero.tag'] || "The Training Academy"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-5xl md:text-7xl lg:text-[110px] font-black italic tracking-tighter text-[#002D72] mt-4 md:mt-6 leading-none uppercase"
          >
            {cms['courses.hero.title1'] || "BUILD YOUR"} <br /> 
            <span className="text-[#0072CE]">{cms['courses.hero.title2'] || "FUTURE."}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="max-w-2xl mx-auto mt-8 md:mt-12 text-slate-500 text-lg md:text-xl font-medium leading-relaxed px-4"
          >
            {cms['courses.hero.description'] || "TPI provides the most practical data cabling courses in the UK. We don't just teach theory; we prepare you for the live site. Master the craft, get certified, and join the network."}
          </motion.p>
        </section>

        {/* 3 COURSE BOXES - PARALLAX SPLIT (matching home page) */}
        <section className="mb-24 md:mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {courseBoxes.map((course, index) => (
              <CourseBox
                key={course.number}
                number={course.number}
                title={course.title}
                description={course.description}
                image={course.image}
                offset={index === 1 ? 30 : index === 0 ? 50 : 70}
                storeLink={course.storeLink}
              />
            ))}
          </div>
        </section>

        {/* DETAILED COURSE CARDS (from database) */}
        {courses.length > 0 && (
          <section className="mb-24 md:mb-40">
            <div className="text-center mb-12 md:mb-16 font-genos">
              <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-xs">Full catalogue</span>
              <h2 className="text-4xl md:text-6xl font-black text-[#002D72] mt-4 tracking-tighter italic">
                All Courses
              </h2>
            </div>
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              {courses.map((course, i) => (
                <motion.div 
                  key={course.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }} 
                  className="col-span-12 md:col-span-6 lg:col-span-4 group cursor-pointer" 
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden h-full flex flex-col hover:border-[#0072CE]/30 transition-all">
                    <div className="relative h-48 md:h-64 overflow-hidden">
                      <Image src={course.image} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                      <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-white/90 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#002D72]">{course.level}</div>
                    </div>
                    <div className="p-6 md:p-10 flex flex-col flex-grow font-genos">
                      <span className="text-[#00A651] font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-2">{course.category}</span>
                      <h3 className="text-2xl md:text-4xl font-black italic text-[#002D72] leading-none mb-4 md:mb-6 group-hover:text-[#0072CE] transition-colors">{course.title}</h3>
                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-10 flex-grow">
                        {(course.benefits || []).slice(0, 3).map((b: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 md:gap-3 text-slate-500 font-medium italic text-sm md:text-base">
                            <CheckCircle2 size={14} className="text-[#00A651] shrink-0" /> 
                            <span className="line-clamp-1">{b}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-slate-50 mt-auto">
                        <div>
                          <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Pricing</p>
                          <p className="text-base md:text-lg font-black text-[#002D72]">{course.price}</p>
                        </div>
                        <div className="bg-[#002D72] text-white p-3 md:p-5 rounded-2xl md:rounded-3xl hover:bg-[#0072CE] transition-all shadow-lg">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS MARQUEE */}
        <section className="py-16 md:py-24 border-y border-slate-100 bg-white/30 backdrop-blur-sm overflow-hidden mb-24 md:mb-40 -mx-4 md:-mx-8 px-4 md:px-8">
          <h2 className="text-center font-genos text-2xl md:text-3xl font-black italic text-[#002D72] uppercase tracking-tight mb-8 md:mb-12">
            {cms['courses.testimonials.title'] || "Kind words from successful connections"}
          </h2>
          <div className="flex whitespace-nowrap marquee-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 md:gap-12 px-3 md:px-6">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-lg inline-flex flex-col min-w-[280px] md:min-w-[400px] font-genos">
                    <div className="flex gap-1 mb-3 md:mb-4 text-[#00A651]">{[...Array(5)].map((_, s) => <Star key={s} size={10} fill="#00A651" />)}</div>
                    <p className="text-base md:text-lg italic font-medium text-[#002D72] whitespace-normal text-proper">&quot;{t}&quot;</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL SUBMISSION */}
        <section className="px-0 mb-24 md:mb-40">
          <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-12 font-genos">
            <div className="col-span-12 lg:col-span-7 p-8 md:p-12 lg:p-20 lg:border-r border-slate-50 text-proper">
              <h2 className="text-4xl md:text-6xl font-black text-[#002D72] italic uppercase tracking-tighter mb-4 leading-none">
                {cms['courses.submit.title'] || "Submit a Testimonial"}
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-8 md:mb-12">
                {cms['courses.submit.desc'] || "Share your experience with the network."}
              </p>
              <form className="space-y-4 md:space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Signal sent to Matrix for approval."); }}>
                <input required placeholder="Full Name" className="bg-slate-50 border-none rounded-2xl md:rounded-3xl p-4 md:p-6 text-base md:text-lg w-full outline-none focus:ring-2 focus:ring-[#0072CE]/20" />
                <textarea required placeholder="Your Message" rows={4} className="bg-slate-50 border-none rounded-2xl md:rounded-3xl p-4 md:p-6 text-base md:text-lg w-full outline-none focus:ring-2 focus:ring-[#0072CE]/20" />
                <button type="submit" className="bg-[#002D72] text-white w-full py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs hover:bg-[#0072CE] transition-all shadow-xl">
                  Submit to Matrix
                </button>
              </form>
            </div>
            <div className="col-span-12 lg:col-span-5 p-8 md:p-12 lg:p-20 bg-slate-50/50 flex flex-col justify-center items-center text-center">
              <Zap size={48} className="text-[#00A651] mb-4 md:mb-6 md:w-16 md:h-16" />
              <h4 className="text-2xl md:text-3xl font-black text-[#002D72] italic uppercase leading-tight">Join the <br /> Connection</h4>
              <p className="text-slate-400 mt-3 md:mt-4 italic font-medium">Your feedback powers the physical internet.</p>
            </div>
          </div>
        </section>

        {/* WHY TPI */}
        <section className="bg-[#002D72] rounded-[2rem] md:rounded-[5rem] p-8 md:p-16 lg:p-24 relative overflow-hidden text-white font-genos mb-0">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <Zap size={300} className="text-white absolute -right-10 md:-right-20 -top-10 md:-top-20 w-[200px] h-[200px] md:w-[400px] md:h-[400px]" />
          </div>
          <div className="relative z-10 grid grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="col-span-12 lg:col-span-6 text-proper">
              <span className="text-[#00A651] font-black uppercase tracking-widest text-[10px] md:text-xs">
                {cms['courses.why.tag'] || "Industry Standard Training"}
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.8] mt-4 md:mt-6 mb-8 md:mb-12 uppercase">
                {cms['courses.why.title'] || "Why Train With TPI?"}
              </h2>
              <div className="space-y-6 md:space-y-8">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Zap className="text-[#00A651]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black italic uppercase">
                      {cms['courses.why.point1.title'] || "Live Site Gear"}
                    </h4>
                    <p className="text-slate-300 italic mt-1 leading-relaxed text-base md:text-lg">
                      {cms['courses.why.point1.desc'] || "Work with actual Fusion Splicers, Fluke testers, and industrial cabling kits."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Shield className="text-[#0072CE]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black italic uppercase">
                      {cms['courses.why.point2.title'] || "ECS Certification"}
                    </h4>
                    <p className="text-slate-300 italic mt-1 leading-relaxed text-base md:text-lg">
                      {cms['courses.why.point2.desc'] || "We provide full guidance on Health & Safety tests and ECS card applications."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-white/5">
              <Image src={cms['courses.why.image'] || "/coursehero.png"} alt="TPI training in action" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002D72]/60 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center group" aria-label="Play training video">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#00A651] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-[#00A651]/40">
                  <Play size={24} className="fill-white text-white ml-1 md:ml-2" />
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* COURSE DETAIL MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCourse(null)} 
              className="absolute inset-0 bg-[#002D72]/95 backdrop-blur-2xl" 
            />
            <motion.div 
              layoutId={`course-${selectedCourse.id}`} 
              className="relative w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl grid grid-cols-12 font-genos text-proper max-h-[90vh] overflow-y-auto"
            >
              <div className="col-span-12 lg:col-span-5 bg-slate-50 relative h-[250px] md:h-[400px] lg:h-full">
                <Image src={selectedCourse.image} alt={selectedCourse.title} fill className="object-cover grayscale" />
                <div className="absolute inset-0 bg-[#002D72]/20" />
                <button 
                  onClick={() => setSelectedCourse(null)} 
                  aria-label="Close" 
                  className="absolute top-6 left-6 md:top-10 md:left-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <X size={18} className="text-[#002D72]" />
                </button>
              </div>
              <div className="col-span-12 lg:col-span-7 p-6 md:p-12 lg:p-20">
                <span className="text-[#00A651] font-black uppercase tracking-widest text-[10px] md:text-xs">{selectedCourse.category}</span>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-black italic text-[#002D72] mt-3 md:mt-4 mb-6 md:mb-8 leading-none uppercase">{selectedCourse.title}</h2>
                <div className="flex flex-wrap gap-4 md:gap-8 mb-6 md:mb-10 text-[#002D72] font-black uppercase text-[9px] md:text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><Calendar size={14} /> {selectedCourse.duration}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} /> Central London</div>
                  <div className="flex items-center gap-2 text-[#00A651]"><Star size={14} fill="#00A651" /> Top Rated</div>
                </div>
                <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-8 md:mb-12 italic">{selectedCourse.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10">
                  <div>
                    <p className="text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest mb-1">Tuition</p>
                    <p className="text-xl md:text-2xl font-black text-[#002D72]">{selectedCourse.price}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 mt-1">{selectedCourse.price_note}</p>
                  </div>
                  <Link href="/contact" className="w-full sm:flex-grow">
                    <button className="w-full bg-[#002D72] text-white py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-[#0072CE] transition-all shadow-xl">
                      Secure Your Space
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; }
        .marquee-track { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .text-proper { text-transform: none; }
      `}</style>
    </div>
  );
}