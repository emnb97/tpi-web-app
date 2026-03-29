"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundWires from "../components/BackgroundWires";
import CartSidebar from "../components/CartSidebar";

const sections = [
  {
    title: "Who We Are",
    content: `The Physical Internet Ltd is a company registered in England and Wales. Registered office: 86-90 Paul Street, 3rd Floor, London, England, EC2A 4NE. We provide structured cabling training, network infrastructure installation services, and related digital products and resources.`,
  },
  {
    title: "Data We Collect",
    content: `When you submit an enquiry or purchase a product through our website, we collect your name, email address, and phone number. We also collect standard web analytics data (pages visited, device type, browser) to improve our service. We do not sell your data to third parties under any circumstances.`,
  },
  {
    title: "How We Use Your Data",
    content: `Your contact details are used solely to respond to your enquiry, process your order, or keep you informed of relevant TPI services you have expressed interest in. We store enquiry data securely in our Supabase database, accessible only to authorised TPI personnel.`,
  },
  {
    title: "Cookies",
    content: `Our website uses minimal cookies required for core functionality (e.g. your shopping cart session). We do not use advertising cookies or third-party tracking cookies. You may disable cookies in your browser settings, though this may affect site functionality.`,
  },
  {
    title: "Your Rights",
    content: `Under UK GDPR, you have the right to access, correct, or request deletion of any personal data we hold about you. To exercise any of these rights, contact us at e.osobu@thephysicalinternet.uk. We will respond within 30 days.`,
  },
  {
    title: "Data Retention",
    content: `Enquiry records are retained for a maximum of 12 months unless you have made a purchase, in which case records are retained for 7 years in line with UK financial regulations. You may request early deletion at any time.`,
  },
  {
    title: "Third-Party Services",
    content: `We use Supabase for secure data storage, Stripe/PayPal for payment processing, and standard hosting infrastructure. Each of these services operates under their own privacy policies and data handling commitments.`,
  },
  {
    title: "Contact",
    content: `For any legal or privacy-related queries, contact The Physical Internet Ltd at e.osobu@thephysicalinternet.uk or by post at 86-90 Paul Street, 3rd Floor, London, EC2A 4NE.`,
  },
];

export default function LegalClient() {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#0072CE] selection:text-white bg-[#F8FAFC] overflow-x-hidden">
      <BackgroundWires />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="relative z-10 flex-grow mb-[75vh] pt-32 md:pt-48 px-4 md:px-8 max-w-[1400px] mx-auto pb-16 md:pb-32">
        <span className="text-[#00A651] font-black uppercase tracking-[0.4em] text-[10px] md:text-sm font-genos">Legal</span>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-[#002D72] leading-[0.85] uppercase tracking-tight md:tracking-tighter mt-4 md:mt-6 mb-4 font-genos">
          Privacy &amp; <br />
          <span className="text-[#0072CE] italic">Policy.</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg font-medium mt-4 md:mt-6 mb-16 md:mb-24 max-w-xl leading-relaxed">Last updated: January 2026. The Physical Internet Ltd is committed to protecting your data and being transparent about how we use it.</p>

        <div className="space-y-8 md:space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm p-6 md:p-12 lg:p-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-1 md:col-span-12 lg:col-span-3">
                <span className="text-[#0072CE] font-black uppercase text-[10px] md:text-xs tracking-widest">0{i + 1}</span>
                <h2 className="text-xl md:text-2xl font-black text-[#002D72] italic uppercase mt-1 md:mt-2 leading-tight font-genos">{section.title}</h2>
              </div>
              <div className="col-span-1 md:col-span-12 lg:col-span-9">
                <p className="text-slate-500 text-base md:text-lg leading-relaxed">{section.content}</p>
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