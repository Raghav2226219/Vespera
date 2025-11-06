import React from "react";
import { motion } from "framer-motion";

const InviteLoader = ({ message = "Checking invite link..." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white overflow-hidden relative">
      {/* Floating glows */}
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full top-10 left-16"
      />
      <motion.div
        animate={{ x: [0, -40, 40, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full bottom-10 right-16"
      />

      {/* Shimmering Vespera logo style text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
      >
        Vespera Invite
      </motion.h1>

      {/* Animated dots */}
      <div className="flex items-center justify-center gap-2 mt-3 text-emerald-200">
        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }}>•</motion.span>
        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>•</motion.span>
        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>•</motion.span>
      </div>

      <p className="text-emerald-100/80 mt-4 text-lg">{message}</p>
    </div>
  );
};

export default InviteLoader;
