// src/components/inviteAudits/InviteAuditHeader.jsx
import React from "react";
import { motion } from "framer-motion";
import VesperaMiniHolo from "../VesperaMiniHolo"; // ✅ adjust path if needed

const InviteAuditHeader = () => {
  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 
                 backdrop-blur-lg bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-emerald-900/50 
                 px-6 py-5 rounded-2xl border border-lime-400/20 
                 shadow-[0_0_25px_rgba(255,255,150,0.12)] relative z-[50]"
    >
      {/* 🌌 Left Section: Holo + Title */}
      <div className="flex items-center gap-4">
        {/* 🔮 Vespera Holo */}
        <div className="scale-90 sm:scale-100">
          <VesperaMiniHolo size={48} />
        </div>

        {/* 🌟 Title & Subtitle */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-lime-300 via-yellow-300 to-white 
                       drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]"
          >
            Invite Audits — All Boards
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lime-200/80 mt-1 text-sm"
          >
            View and filter invite activity across all boards.
          </motion.p>
        </div>
      </div>

      {/* 🟡 Decorative Animated Beam */}
      <motion.div
        className="hidden sm:block absolute bottom-2 right-8 w-40 h-[2px] rounded-full 
                   bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </header>
  );
};

export default InviteAuditHeader;
