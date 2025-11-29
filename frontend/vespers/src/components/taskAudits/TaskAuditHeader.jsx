import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import VesperaMiniHolo from "../VesperaMiniHolo"; // Ensure path is correct

const TaskAuditHeader = () => {
  const navigate = useNavigate();

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
                 w-full max-w-7xl mx-auto mb-10 px-6 py-5
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
            Task Activity Log
          </h1>
          <p className="text-lime-200/80 mt-1 text-sm">
            Track all updates, moves, and changes to your tasks
          </p>
        </div>
      </div>
    </header>
  );
};

export default TaskAuditHeader;
