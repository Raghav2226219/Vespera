// src/components/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const Toast = ({ show, message }) => {
  if (!show) return null;

  // Choose color/icon based on message
  let gradient = "from-emerald-400 via-cyan-400 to-emerald-500";
  let Icon = CheckCircle;
  if (message.toLowerCase().includes("delete")) {
    gradient = "from-red-500 via-orange-500 to-yellow-400";
    Icon = XCircle;
  } else if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")) {
    gradient = "from-rose-500 via-red-500 to-orange-500";
    Icon = AlertTriangle;
  }

  const toastElement = (
    <div
      className="fixed top-6 right-6 flex flex-col gap-3 items-end z-[99999] pointer-events-none"
      id="toast-container"
    >
      <AnimatePresence>
        {show && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl
                        text-gray-900 font-semibold
                        bg-gradient-to-r ${gradient}
                        shadow-[0_0_25px_rgba(0,0,0,0.3)]
                        border border-white/20 backdrop-blur-xl
                        pointer-events-auto select-none`}
          >
            <Icon className="w-5 h-5 text-gray-900" />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Render globally (avoids stacking and clipping issues)
  return createPortal(toastElement, document.body);
};

export default Toast;
