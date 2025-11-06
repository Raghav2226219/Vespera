// src/components/Toast.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { CheckCircle } from "lucide-react";

const ToastContent = ({ show, message, icon }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-6 right-6 bg-gradient-to-r from-emerald-500 to-cyan-400 
                   text-gray-900 font-semibold shadow-[0_0_25px_rgba(16,185,129,0.5)] 
                   px-6 py-3 rounded-xl flex items-center gap-3 z-[99999] pointer-events-auto"
      >
        {icon || <CheckCircle className="w-5 h-5 text-gray-900" />}
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const Toast = ({ show, message, icon }) => {
  return createPortal(
    <ToastContent show={show} message={message} icon={icon} />,
    document.body
  );
};

export default Toast;
