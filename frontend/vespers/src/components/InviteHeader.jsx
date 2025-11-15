import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import VesperaMiniHolo from "../components/VesperaMiniHolo";

const InviteHeader = () => {
  const navigate = useNavigate();

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
                 w-full max-w-7xl mx-auto mt-8 px-6 py-5
                 rounded-2xl border border-lime-400/20
                 backdrop-blur-lg bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-emerald-900/50
                 shadow-[0_0_25px_rgba(255,255,150,0.12)] relative z-[50]"
    >
      {/* 🌌 Left Section — Holo + Title */}
      <div className="flex items-center gap-4">
        {/* 🔮 Hologram */}
        <div className="scale-90 sm:scale-100">
          <VesperaMiniHolo size={48} />
        </div>

        {/* 🌟 Title */}
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent 
                         bg-gradient-to-r from-lime-300 via-yellow-300 to-white 
                         drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]">
            Invite Members
          </h1>
          <p className="text-lime-200/80 mt-1 text-sm">
            Send invitations to collaborate on this board
          </p>
        </div>
      </div>

      {/* 🔙 Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium 
                   bg-gradient-to-r from-emerald-700 via-lime-500/80 to-yellow-400/70
                   text-gray-900 shadow-[0_0_20px_rgba(190,255,150,0.3)]
                   hover:shadow-[0_0_30px_rgba(255,255,150,0.45)] transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>
    </header>
  );
};

export default InviteHeader;
