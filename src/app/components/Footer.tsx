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
              href={cms['footer.instagram'] || "https://www.instagram.com/thephysicalinternet?igsh=MTBiaHc1a2RkdXBwYg%3D"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TPI on Instagram"
              className="p-4 bg-white/10 rounded-2xl hover:bg-[#00A651] transition-colors cursor-pointer"
            >
              <Instagram size={28} />
            </a>
            <a
              href={cms['footer.tiktok'] || "https://www.tiktok.com/@manny_tpi"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TPI on TikTok"
              className="p-4 bg-white/10 rounded-2xl hover:bg-[#0072CE] transition-colors cursor-pointer"
            >
              <Linkedin size={28} />
            </a>
            <a
              href={`mailto:${cms['footer.email'] || "e.osobu@thephysicalinternet.uk"}`}
              aria-label="Email TPI"
              className="p-4 bg-white/10 rounded-2xl hover:bg-white hover:text-[#002D72] transition-colors cursor-pointer"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-8 uppercase font-black text-xs tracking-[0.2em] text-proper">
          <div className="flex flex-col gap-6">
            <span className="text-[#00A651] font-genos">Platform</span>
            <Link href="/" className="opacity-40 hover:opacity-100 transition-opacity">Home</Link>
            <Link href="/courses" className="opacity-40 hover:opacity-100 transition-opacity">Training &amp; courses</Link>
            <Link href="/services/structured-cabling" className="opacity-40 hover:opacity-100 transition-opacity">Installation services</Link>
            <Link href="/store" className="opacity-40 hover:opacity-100 transition-opacity">Store</Link>
            <Link href="/about" className="opacity-40 hover:opacity-100 transition-opacity">About</Link>
          </div>
          <div className="flex flex-col gap-6 text-right">
            <span className="text-[#0072CE] font-genos">Legal</span>
            <Link href="/legal" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">Legal page</Link>
            <Link href="/terms" className="opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted">T&amp;Cs</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full pt-12 border-t border-white/10 text-[10px] opacity-40 uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between gap-4 font-proper">
        <div className="flex flex-col gap-1">
          <p className="font-black">{cms['footer.company_name'] || "The Physical Internet ltd"}</p>
          <p className="italic">{cms['footer.address'] || "86-90 Paul Street, 3rd Floor, London, England, EC2A 4NE"}</p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className="font-black">{cms['footer.phone'] || "07487361240"}</p>
          <p>{cms['footer.copyright'] || "© 2026 The Physical Internet. Registered in England & Wales."}</p>
        </div>
      </div>
    </footer>
  );
}
