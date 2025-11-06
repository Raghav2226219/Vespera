import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const GlassModal = ({ show, onClose, title, description }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 w-[90%] max-w-md rounded-3xl border border-emerald-400/20 
                       bg-gradient-to-br from-gray-900/80 via-emerald-950/70 to-gray-900/80
                       shadow-[0_0_40px_rgba(16,185,129,0.2)] text-center"
          >
            <h2 className="text-2xl font-semibold text-emerald-300 mb-3">{title}</h2>
            <p className="text-emerald-100 mb-6">{description}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
              >
                Login
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all"
              >
                Register
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
