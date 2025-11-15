// src/components/ActionDonePopup.jsx
import { motion, AnimatePresence } from "framer-motion";

const ActionDonePopup = ({ message = "Action completed!", show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md 
                     z-[9999] overflow-hidden select-none"  // ✅ prevents scroll
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            className="relative px-12 py-10 rounded-3xl overflow-hidden
                       border border-yellow-400/25 shadow-[0_0_35px_rgba(255,255,150,0.2)]
                       bg-gradient-to-br from-[#0b1914]/90 via-[#153022]/85 to-[#1f4a33]/80
                       flex flex-col items-center justify-center text-center backdrop-blur-2xl"
          >
            {/* ✨ Background holo glow (contained, no overflow) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-lime-400/15 to-transparent blur-[80px]"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 🌈 Top holo beam line */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[2px] 
                         bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* ✅ Animated Check Container */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
              className="relative w-20 h-20 flex items-center justify-center rounded-full 
                         bg-gradient-to-br from-yellow-300 via-lime-300 to-emerald-300
                         shadow-[0_0_35px_rgba(255,255,150,0.4)]"
            >
              {/* Inner pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-yellow-200/40"
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Checkmark */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="black"
                className="w-10 h-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>

            {/* 🪩 Success Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl font-extrabold tracking-wide text-transparent bg-clip-text
                         bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300
                         drop-shadow-[0_0_15px_rgba(255,255,150,0.3)]"
            >
              {message}
            </motion.p>

            {/* 💫 Shimmer underline beam */}
            <motion.div
              animate={{ opacity: [0.3, 0.9, 0.3], scaleX: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2 w-32 h-[2px] rounded-full 
                         bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent"
            />

            {/* ✨ Floating Particles (clipped, no overflow) */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300/60 
                             shadow-[0_0_10px_rgba(255,255,150,0.4)]"
                  initial={{
                    x: Math.random() * 140 - 70,
                    y: Math.random() * 90 - 45,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * -30 - 20],
                    opacity: [0, 1, 0],
                    scale: [0.3, 1, 0.3],
                  }}
                  transition={{
                    delay: Math.random() * 1.5,
                    duration: 3 + Math.random() * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionDonePopup;
