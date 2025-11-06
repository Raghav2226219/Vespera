// src/components/ConfirmDeleteModal.jsx
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDeleteModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[2000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onCancel}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative p-6 w-[90%] max-w-md rounded-2xl overflow-hidden text-white text-center
                     border border-emerald-300/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]
                     backdrop-blur-xl bg-gradient-to-br from-white/10 via-emerald-900/20 to-gray-900/60"
        >
          {/* ✨ Light Reflection (Top) */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
          {/* ✨ Inner Glow */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 shadow-inner shadow-emerald-400/5 pointer-events-none" />
          {/* ✨ Animated Light Sweep */}
          <motion.div
            className="absolute top-0 left-[-30%] w-[60%] h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40"
            animate={{ x: ["-30%", "130%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Header */}
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300 mb-4 drop-shadow-[0_0_12px_rgba(255,180,60,0.5)]">
            Confirm Permanent Delete
          </h2>

          {/* Description */}
          <p className="text-emerald-100/80 mb-6 text-sm leading-relaxed">
            This action will permanently delete your board and all related data. <br />
            <span className="text-red-300 font-medium">This cannot be undone.</span>
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            {/* Cancel Button */}
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl font-semibold border border-white/20
                         bg-white/10 hover:bg-white/20 text-emerald-100
                         backdrop-blur-sm shadow-inner transition-all duration-300"
            >
              Cancel
            </motion.button>

            {/* Delete Button */}
            <motion.button
              onClick={onConfirm}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500
                         hover:from-red-500 hover:to-yellow-400
                         shadow-[0_0_18px_rgba(255,100,50,0.5)]
                         transition-all duration-300"
            >
              Delete Permanently
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
