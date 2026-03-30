"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { getSiteContent } from "../actions/admin";

export default function Footer() {
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCms() {
      const data = await getSiteContent();
      const mapping = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.content }), {});
      setCms(mapping);
    }
    loadCms();
  }, []);

  return (
    <footer className="sticky bottom-0 left-0 w-full h-[75vh] bg-[#002D72] text-white z-0 flex flex-col justify-between p-12 md:p-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-12 font-genos font-proper">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="text-[12vw] lg:text-[8vw] font-black italic tracking-tighter leading-[0.8] mb-12 text-proper">
            {(cms['footer.heading'] || "Stay Connected.").split(' ').map((w, i) => <span key={i}>{w}<br /></span>)}
          </h2>
          <div className="flex gap-4">
            <a
              href={cms['footer.instagram'] || "https://www.instagram.com/thephysicalinternet"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#002D72] transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href={cms['footer.tiktok'] || "https://www.tiktok.com/@manny_tpi"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#002D72] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href={`mailto:${cms['footer.email'] || "e.osobu@thephysicalinternet.uk"}`}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#002D72] transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col md:flex-row justify-between lg:justify-end gap-12 lg:gap-24 uppercase tracking-[0.2em] text-xs font-black">
          <div className="flex flex-col gap-6">
            <span className="text-[#0072CE] font-genos">Navigation</span>
            <Link href="/courses" className="opacity-40 hover:opacity-100 transition-opacity">Training</Link>
            <Link href="/services/structured-cabling" className="opacity-40 hover:opacity-100 transition-opacity">Installation services</Link>
            <Link href="/store" className="opacity-40 hover:opacity-100 transition-opacity">Store</Link>
            <Link href="/about" className="opacity-40 hover:opacity-100 transition-opacity">About</Link>
          </div>
          <div className="flex flex-col gap-6 text-left md:text-right">
            <span className="text-[#0072CE] font-genos">Legal</span>
            <Link href="/legal" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">Legal page</Link>
            <Link href="/terms" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">T&amp;Cs</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full pt-12 border-t border-white/10 text-[10px] uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between gap-4 font-proper">
        <div className="flex flex-col gap-1 opacity-40">
          <p className="font-black">{cms['footer.company_name'] || "The Physical Internet ltd"}</p>
          <p className="italic">{cms['footer.address'] || "86-90 Paul Street, 3rd Floor, London, England, EC2A 4NE"}</p>
        </div>
        <div className="flex flex-col gap-1 text-left md:text-right mt-4 md:mt-0">
          <p className="font-black opacity-40">{cms['footer.phone'] || "07487 361 240"}</p>
          <p className="italic mb-2 opacity-40">{cms['footer.email'] || "e.osobu@thephysicalinternet.uk"}</p>
          
          {/* subtle link injected here */}
          <p className="text-[8px] opacity-40 hover:opacity-100 transition-opacity mt-2 md:mt-0">
            Built and managed by <a href="https://ebwebservices.co.uk" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted font-bold">ebwsuk</a>
          </p>
        </div>
      </div>
    </footer>
  );
}