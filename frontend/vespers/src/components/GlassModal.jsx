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
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[9999]"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative p-8 w-[90%] max-w-md rounded-3xl border border-yellow-400/20 
                       bg-gradient-to-br from-[#0d1f17]/90 via-[#153624]/85 to-[#1b452c]/85
                       shadow-[0_0_40px_rgba(255,255,150,0.15)] text-center overflow-hidden"
          >
            {/* ✨ Floating background gradient beam */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-lime-400/10 to-transparent blur-2xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* ✴️ Soft inner glow ring */}
            <div className="absolute inset-0 rounded-3xl border border-yellow-300/10 shadow-[inset_0_0_20px_rgba(255,255,150,0.08)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent 
                             bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                             drop-shadow-[0_0_18px_rgba(255,255,150,0.25)] mb-3">
                {title}
              </h2>
              <p className="text-yellow-100/80 mb-8 leading-relaxed">
                {description}
              </p>

              <div className="flex justify-center gap-4">
                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/login")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-900
                             bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300
                             hover:shadow-[0_0_20px_rgba(255,255,150,0.4)]
                             transition-all duration-300"
                >
                  Login
                </motion.button>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/register")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-900
                             bg-gradient-to-r from-lime-400 via-yellow-400 to-emerald-400
                             hover:shadow-[0_0_20px_rgba(255,255,150,0.35)]
                             transition-all duration-300"
                >
                  Register
                </motion.button>
              </div>
            </div>

            {/* 💡 Subtle holo underline shimmer */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-[2px] 
                         rounded-full bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
