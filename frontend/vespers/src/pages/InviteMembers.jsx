import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import ActionDonePopup from "../components/ActionDonePopup";
import InviteForm from "../components/InviteForm";
import InviteHeader from "../components/InviteHeader";

const InviteMembers = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start
                 bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 
                 px-4 py-8 relative overflow-hidden text-white"
    >
      {/* ✅ Glowing background */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* ✅ Invite Header */}
      <div className="w-full max-w-7xl mt-[-20px] mb-8">
        <InviteHeader />
      </div>

      {/* ✅ Animate form & toast */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 w-full flex flex-col items-center mt-20" 
        // ⬆️ Increased top margin to move form lower (was -10px before)
      >
        {/* Toast (5 seconds) */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-8 right-8 bg-gradient-to-r from-emerald-500 to-cyan-400 
                         text-gray-900 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.4)] 
                         px-6 py-3 rounded-xl flex items-center gap-3 z-[9999]"
            >
              <CheckCircle className="w-5 h-5 text-gray-900" />
              <span>Invite sent successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup */}
        <ActionDonePopup
          message="Invite successfully sent!"
          show={showPopup}
          onClose={() => setShowPopup(false)}
        />

        {/* Form */}
        <InviteForm
          onSuccess={() => {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
          }}
        />
      </motion.div>
    </div>
  );
};

export default InviteMembers;
