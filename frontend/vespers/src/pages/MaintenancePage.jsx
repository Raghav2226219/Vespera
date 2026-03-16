import React from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, AlertTriangle } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050f0c]/95 backdrop-blur-xl text-white p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full bg-[#0b1914] border border-yellow-500/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.2)]"
      >
        <div className="w-20 h-20 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
          <Wrench className="w-10 h-10 text-yellow-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Under Development</h1>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We're currently building something amazing. Vespera is under active 
          development and will be available soon.
        </p>

        <div className="flex items-center justify-center gap-2 text-yellow-400/80 bg-yellow-500/5 py-3 px-4 rounded-xl border border-yellow-500/10">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">Check back soon — we're almost ready</span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
          <AlertTriangle className="w-4 h-4" />
          <span>Vespera Systems • Status: Under Development</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
