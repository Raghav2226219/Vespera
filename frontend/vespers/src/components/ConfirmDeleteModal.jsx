import { motion, AnimatePresence } from "framer-motion";

const ConfirmDeleteModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[2000]"
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
            className="relative p-8 w-[90%] max-w-md rounded-3xl text-center overflow-hidden
                       border border-yellow-300/20 
                       bg-gradient-to-br from-[#0d1f17]/90 via-[#271f12]/85 to-[#351d14]/85
                       shadow-[0_0_35px_rgba(255,255,150,0.15)] backdrop-blur-2xl"
          >
            {/* ✨ Background glow animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-transparent blur-2xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* ✴️ Light sweep beam */}
            <motion.div
              className="absolute top-0 left-[-30%] w-[60%] h-full bg-gradient-to-tr from-transparent via-yellow-200/15 to-transparent"
              animate={{ x: ["-30%", "130%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 🟢 Inner ring glow */}
            <div className="absolute inset-0 rounded-3xl border border-yellow-300/15 shadow-inner shadow-yellow-400/10 pointer-events-none" />

            {/* ⚠️ Title */}
            <h2 className="relative z-10 text-3xl font-extrabold bg-clip-text text-transparent 
                           bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 
                           drop-shadow-[0_0_18px_rgba(255,180,100,0.35)] mb-3">
              Confirm Permanent Delete
            </h2>

            {/* Description */}
            <p className="relative z-10 text-yellow-100/80 mb-6 text-sm leading-relaxed">
              This action will permanently delete your board and all related data.
              <br />
              <span className="text-red-400 font-semibold">
                This cannot be undone.
              </span>
            </p>

            {/* Buttons */}
            <div className="relative z-10 flex justify-center gap-4 mt-5">
              {/* Cancel Button */}
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl font-semibold text-lime-100
                           bg-gradient-to-r from-[#203121]/50 via-[#1b2b1d]/40 to-[#162219]/50
                           border border-yellow-300/15 hover:border-yellow-300/25
                           hover:shadow-[0_0_15px_rgba(255,255,150,0.25)]
                           backdrop-blur-md transition-all duration-300"
              >
                Cancel
              </motion.button>

              {/* Delete Button */}
              <motion.button
                onClick={onConfirm}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-900
                           bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                           hover:from-red-400 hover:via-orange-300 hover:to-yellow-200
                           shadow-[0_0_25px_rgba(255,200,100,0.4)]
                           transition-all duration-300"
              >
                Delete Permanently
              </motion.button>
            </div>

            {/* ✨ Animated underline beam */}
            <motion.div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 w-24 h-[2px] 
                         rounded-full bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
