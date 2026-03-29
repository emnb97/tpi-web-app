"use client";

import { motion } from "framer-motion";

export default function BackgroundWires() {
  return (
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none overflow-hidden bg-[#F8FAFC]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-60"
      >
        <motion.path
          d="M-5 20 C 30 20, 70 80, 105 80"
          stroke="#002D72"
          strokeWidth="0.2"
          fill="none"
          strokeOpacity="0.1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
        <motion.path
          d="M-5 20 C 30 20, 70 80, 105 80"
          stroke="#002D72"
          strokeWidth="0.1"
          fill="none"
          strokeDasharray="1 1"
          initial={{ pathLength: 0, strokeOpacity: 0.3 }}
          animate={{ pathLength: 1, strokeOpacity: [0.3, 0.6, 0.3] }}
          transition={{
            pathLength: { duration: 5, ease: "easeInOut" },
            strokeOpacity: { duration: 3, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.path
          d="M-5 80 C 40 80, 60 20, 105 20"
          stroke="#002D72"
          strokeWidth="0.2"
          fill="none"
          strokeOpacity="0.05"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, ease: "easeInOut", delay: 1 }}
        />
        <motion.path
          d="M-5 80 C 40 80, 60 20, 105 20"
          stroke="#00A651"
          strokeWidth="0.15"
          fill="none"
          initial={{ pathLength: 0, strokeOpacity: 0.3 }}
          animate={{ pathLength: 1, strokeOpacity: [0.3, 0.5, 0.3] }}
          transition={{
            pathLength: { duration: 6, ease: "easeInOut", delay: 1 },
            strokeOpacity: { duration: 4, repeat: Infinity, ease: "linear", delay: 1 },
          }}
        />
      </svg>
    </div>
  );
}
