"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen pt-48 px-8 font-genos">
      <div className="max-w-[1400px] mx-auto">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#00A651] font-black uppercase tracking-[0.4em] text-sm"
        >
          Our Story
        </motion.span>
        
        <div className="grid grid-cols-12 gap-12 mt-8">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="text-7xl md:text-9xl font-black text-[#002D72] leading-[0.8] uppercase tracking-tighter">
              Guarding the <br/> 
              <span className="text-[#00A651] italic">Pulse</span> of the <br/> 
              World.
            </h1>
          </div>
          
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">
              Every upload, every download, and every digital connection runs through the copper and fibre cables that TPI technicians install and maintain. We are the backbone of the digital age.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <section className="py-32 grid grid-cols-12 gap-12 border-t border-slate-100 mt-32">
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-[#002D72] text-4xl font-black uppercase italic italic mb-8">What is the data cabling industry?</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-6">
              Everything you do on the internet—that new Netflix show, that game download, that online booking—all runs through the physical infrastructure we build.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 bg-slate-50 rounded-[3rem] p-12">
            <p className="text-lg text-slate-500 italic">
              "TPI provides the practical and theoretical training to give you all the preparation you need to forge a career in the data cabling and data centre industry."
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}