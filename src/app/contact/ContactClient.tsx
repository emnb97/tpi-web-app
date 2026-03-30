"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Send, CheckCircle, Phone, Mail, MapPin, Instagram, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";
import { getSiteContent, submitEnquiry } from "../actions/admin";

// TikTok Icon Component
const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface ContactFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactClient() {
  const [mounted, setMounted] = useState(false);
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadCms() {
      try {
        const data = await getSiteContent();
        const mapping = data.reduce((acc: Record<string, string>, curr: { id: string; content: string }) => ({ ...acc, [curr.id]: curr.content }), {});
        setCms(mapping);
      } catch (error) {
        console.error('Failed to load CMS:', error);
      } finally {
        setCmsLoaded(true);
      }
    }
    loadCms();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Save to Supabase (admin portal) — this is the primary data store
      const supabaseRes = await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
      });

      // 2. Also try Netlify Forms (fire-and-forget — don't let it block success)
      const myForm = e.currentTarget;
      const netlifyData = new FormData(myForm);
      const params = new URLSearchParams();
      netlifyData.forEach((value, key) => {
        params.append(key, value as string);
      });

      fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }).catch(() => {
        // Netlify form submission is optional — Supabase is the source of truth
        console.log("Netlify Forms POST failed (non-critical)");
      });

      if (supabaseRes.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError("Submission failed. Please try again or email us directly.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setFormData({
      name: "",
      company: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white overflow-x-hidden bg-white">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Form detection is handled by public/__forms.html (static file).
           Netlify's build bot cannot see forms inside React components. */}

      <main className="bg-white min-h-screen pt-32 md:pt-40 px-4 md:px-8 font-genos relative z-10 flex-grow mb-[75vh]">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Back Link */}
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#002D72] transition-colors mb-8 cursor-pointer group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to home</span>
            </motion.div>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm">
              {cms['contact.hero.tag'] || "Let's Talk"}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-[#002D72] leading-[0.85] uppercase tracking-tighter mt-4">
              Get in <span className="text-[#00A651] italic">touch</span><br />
              with TPI
            </h1>
          </motion.div>

          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-12 lg:col-span-7"
            >
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={handleSubmit}
                      name="contact"
                      method="POST"
                      className="p-6 md:p-14"
                    >
                      {/* Hidden fields for Netlify */}
                      <input type="hidden" name="form-name" value="contact" />
                      <p className="hidden">
                        <label>
                          Don&apos;t fill this out if you&apos;re human:
                          <input name="bot-field" />
                        </label>
                      </p>

                      <div className="space-y-8">
                        {/* Name & Company Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                            <motion.label
                              animate={{ 
                                color: focusedField === 'name' ? '#002D72' : '#94a3b8',
                                y: focusedField === 'name' || formData.name ? -24 : 0,
                                scale: focusedField === 'name' || formData.name ? 0.85 : 1,
                              }}
                              className="absolute left-0 top-4 font-bold uppercase tracking-widest text-xs origin-left pointer-events-none transition-all"
                            >
                              Your name *
                            </motion.label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full pt-8 pb-4 bg-transparent border-b-2 border-slate-200 focus:border-[#002D72] outline-none text-xl font-medium text-[#002D72] transition-colors"
                            />
                          </div>
                          <div className="relative">
                            <motion.label
                              animate={{ 
                                color: focusedField === 'company' ? '#002D72' : '#94a3b8',
                                y: focusedField === 'company' || formData.company ? -24 : 0,
                                scale: focusedField === 'company' || formData.company ? 0.85 : 1,
                              }}
                              className="absolute left-0 top-4 font-bold uppercase tracking-widest text-xs origin-left pointer-events-none transition-all"
                            >
                              Company (optional)
                            </motion.label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('company')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full pt-8 pb-4 bg-transparent border-b-2 border-slate-200 focus:border-[#002D72] outline-none text-xl font-medium text-[#002D72] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Phone & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                            <motion.label
                              animate={{ 
                                color: focusedField === 'phone' ? '#002D72' : '#94a3b8',
                                y: focusedField === 'phone' || formData.phone ? -24 : 0,
                                scale: focusedField === 'phone' || formData.phone ? 0.85 : 1,
                              }}
                              className="absolute left-0 top-4 font-bold uppercase tracking-widest text-xs origin-left pointer-events-none transition-all"
                            >
                              Phone number *
                            </motion.label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full pt-8 pb-4 bg-transparent border-b-2 border-slate-200 focus:border-[#002D72] outline-none text-xl font-medium text-[#002D72] transition-colors"
                            />
                          </div>
                          <div className="relative">
                            <motion.label
                              animate={{ 
                                color: focusedField === 'email' ? '#002D72' : '#94a3b8',
                                y: focusedField === 'email' || formData.email ? -24 : 0,
                                scale: focusedField === 'email' || formData.email ? 0.85 : 1,
                              }}
                              className="absolute left-0 top-4 font-bold uppercase tracking-widest text-xs origin-left pointer-events-none transition-all"
                            >
                              Email address *
                            </motion.label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full pt-8 pb-4 bg-transparent border-b-2 border-slate-200 focus:border-[#002D72] outline-none text-xl font-medium text-[#002D72] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="relative">
                          <motion.label
                            animate={{ 
                              color: focusedField === 'message' ? '#002D72' : '#94a3b8',
                              y: focusedField === 'message' || formData.message ? -24 : 0,
                              scale: focusedField === 'message' || formData.message ? 0.85 : 1,
                            }}
                            className="absolute left-0 top-4 font-bold uppercase tracking-widest text-xs origin-left pointer-events-none transition-all"
                          >
                            Tell us what you need *
                          </motion.label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            required
                            rows={4}
                            className="w-full pt-8 pb-4 bg-transparent border-b-2 border-slate-200 focus:border-[#002D72] outline-none text-xl font-medium text-[#002D72] transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Error message */}
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium text-center"
                        >
                          {submitError}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-12 w-full bg-[#002D72] text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-[#0072CE] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send message
                            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="p-6 md:p-20 text-center"
                    >
                      {/* Logo Flip Animation */}
                      <motion.div 
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: [0, 180, 360, 540, 720] }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="relative w-40 h-40 mx-auto mb-10 [perspective:2000px]"
                      >
                        <motion.div
                          animate={{ rotateY: [0, 180, 360, 540, 720] }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="relative w-full h-full [transform-style:preserve-3d]"
                        >
                          <div className="absolute inset-0 [backface-visibility:hidden]">
                            <Image src="/tpilogo.png" alt="TPI" fill className="object-contain" sizes="160px" />
                          </div>
                          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            <Image src="/tpilogo2.png" alt="TPI" fill className="object-contain" sizes="160px" />
                          </div>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="w-16 h-16 bg-[#00A651] rounded-full flex items-center justify-center mx-auto mb-8">
                          <CheckCircle size={32} className="text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#002D72] italic uppercase tracking-tighter mb-4">
                          Message sent!
                        </h2>
                        <p className="text-xl text-slate-500 mb-10 max-w-md mx-auto">
                          Thanks for reaching out, {formData.name.split(' ')[0]}! We&apos;ll get back to you within 24 hours.
                        </p>
                        <button
                          onClick={handleReset}
                          className="inline-flex items-center gap-2 text-[#0072CE] font-bold hover:text-[#002D72] transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Send another message
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-12 lg:col-span-5 space-y-8"
            >
              {/* Contact Cards */}
              <div className="bg-[#002D72] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white">
                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-8">
                  Contact info
                </h3>
                <div className="space-y-6">
                  <a 
                    href={`mailto:${cms['footer.email'] || "e.osobu@thephysicalinternet.uk"}`}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#0072CE] rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">Email</p>
                      <p className="font-bold text-sm md:text-base group-hover:text-[#00A651] transition-colors">
                        {cms['footer.email'] || "e.osobu@thephysicalinternet.uk"}
                      </p>
                    </div>
                  </a>
                  <a 
                    href={`tel:${cms['footer.phone'] || "07487361240"}`}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#00A651] rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">Phone</p>
                      <p className="font-bold text-sm md:text-base group-hover:text-[#00A651] transition-colors">
                        {cms['footer.phone'] || "07487 361 240"}
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">Address</p>
                      <p className="font-bold text-sm leading-relaxed">
                        {cms['footer.address'] || "86-90 Paul Street, 3rd Floor, London, England, EC2A 4NE"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-10">
                <h3 className="text-2xl font-black text-[#002D72] italic uppercase tracking-tight mb-6">
                  Follow TPI
                </h3>
                <p className="text-slate-500 mb-8">
                  Stay connected for training updates, industry news, and behind-the-scenes content.
                </p>
                <div className="flex gap-4">
                  <a
                    href={cms['footer.instagram'] || "https://www.instagram.com/thephysicalinternet"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] hover:shadow-lg transition-all"
                  >
                    <Instagram size={20} />
                    Instagram
                  </a>
                  <a
                    href={cms['footer.tiktok'] || "https://www.tiktok.com/@manny_tpi"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 p-5 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] hover:shadow-lg transition-all"
                  >
                    <TikTokIcon size={20} />
                    TikTok
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10">
                <h3 className="text-xl font-black text-[#002D72] italic uppercase tracking-tight mb-6">
                  Quick links
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/courses"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <span className="font-bold text-[#002D72]">View our courses</span>
                    <ArrowRight size={16} className="text-[#0072CE] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/services/structured-cabling"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <span className="font-bold text-[#002D72]">Installation services</span>
                    <ArrowRight size={16} className="text-[#0072CE] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/about"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                  >
                    <span className="font-bold text-[#002D72]">About TPI</span>
                    <ArrowRight size={16} className="text-[#0072CE] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
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