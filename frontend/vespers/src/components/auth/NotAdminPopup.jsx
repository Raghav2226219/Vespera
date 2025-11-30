import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { AlertTriangle, ArrowRight } from "lucide-react";

const NotAdminPopup = ({ show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="relative p-8 w-[90%] max-w-md rounded-3xl border border-rose-500/30 
                       bg-gradient-to-br from-[#1a0505] via-[#2a0a0a] to-[#1f0808]
                       shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center overflow-hidden"
          >
            {/* 🚨 Animated Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-orange-500/5 to-transparent blur-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Access Restricted
              </h2>
              
              <p className="text-rose-100/70 mb-8 leading-relaxed text-sm">
                You are not an admin. Please login through the normal user portal to access your account.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  window.location.href = "/login";
                }}
                className="w-full py-3.5 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-rose-600 to-orange-600
                           hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]
                           border border-rose-400/20
                           flex items-center justify-center gap-2
                           transition-all duration-300 group"
              >
                Go to User Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotAdminPopup;
