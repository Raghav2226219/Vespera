// src/components/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const Toast = ({ show, message }) => {
  if (!show) return null;

  // 🌈 Dynamic theme selection
  let gradient = "from-lime-300 via-yellow-300 to-emerald-300";
  let Icon = CheckCircle;
  let shadowColor = "rgba(255, 255, 150, 0.35)";
  let accentGlow = "shadow-[0_0_25px_rgba(255,255,120,0.35)]";

  if (message.toLowerCase().includes("delete")) {
    gradient = "from-red-500 via-amber-400 to-yellow-300";
    Icon = XCircle;
    shadowColor = "rgba(255, 170, 80, 0.45)";
  } else if (
    message.toLowerCase().includes("fail") ||
    message.toLowerCase().includes("error")
  ) {
    gradient = "from-rose-500 via-orange-500 to-amber-400";
    Icon = AlertTriangle;
    shadowColor = "rgba(255, 120, 80, 0.4)";
  } else if (message.toLowerCase().includes("restore")) {
    gradient = "from-lime-300 via-yellow-300 to-cyan-300";
    Icon = CheckCircle;
    shadowColor = "rgba(255, 255, 180, 0.4)";
  }

  const toastElement = (
    <div
      id="toast-container"
      className="fixed top-6 right-6 flex flex-col gap-3 items-end z-[99999] pointer-events-none 
                 overflow-hidden max-w-full no-scrollbar select-none"
    >
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative flex items-center gap-3 px-5 py-3 rounded-xl
                        text-gray-900 font-semibold
                        bg-gradient-to-r ${gradient}
                        border border-white/20 backdrop-blur-xl
                        ${accentGlow}
                        shadow-[0_0_30px_rgba(0,0,0,0.4)]
                        pointer-events-auto select-none
                        overflow-hidden`}
            style={{
              boxShadow: `0 0 35px ${shadowColor}, inset 0 0 15px rgba(255,255,200,0.1)`,
            }}
          >
            {/* 🌕 Icon */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex items-center justify-center"
            >
              <Icon className="w-5 h-5 text-gray-900 drop-shadow-[0_0_4px_rgba(255,255,150,0.4)]" />
            </motion.div>

            {/* 💬 Message */}
            <span className="tracking-wide text-sm md:text-base drop-shadow-[0_0_6px_rgba(255,255,150,0.3)]">
              {message}
            </span>

            {/* 💫 Moving highlight beam */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none
                         bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,200,0.18)_45%,transparent_65%)]
                         opacity-70"
              animate={{ x: ["-120%", "130%"] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(toastElement, document.body);
};

export default Toast;
