// src/pages/InviteMembers.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ActionDonePopup from "../components/ActionDonePopup";
import InviteForm from "../components/InviteForm";
import InviteHeader from "../components/InviteHeader";
import Toast from "../components/Toast";

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
      className="h-screen w-screen flex flex-col items-center justify-start
                 bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29]
                 px-4 sm:px-6 relative overflow-hidden text-white
                 no-scrollbar"
    >
      {/* 🌟 Background Glows (contained) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[22%] left-[22%] w-[25rem] h-[25rem] 
                     bg-yellow-400/15 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 25, -25, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[18%] right-[20%] w-[25rem] h-[25rem] 
                     bg-lime-400/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] 
                     bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] 
                     bg-gradient-to-r from-transparent via-lime-300/20 to-transparent"
        />
      </div>

      {/* ✅ Header */}
      <div className="w-full max-w-7xl pt-6 pb-4">
        <InviteHeader />
      </div>

      {/* ✅ Main Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 flex flex-col items-center flex-1 justify-center gap-8 
                   w-full max-w-4xl"
      >
        {/* Toast Notification */}
        <Toast show={showToast} message="Invite sent successfully!" />

        {/* Success Popup */}
        <ActionDonePopup
          message="Invite successfully sent!"
          show={showPopup}
          onClose={() => setShowPopup(false)}
        />

        {/* 🧾 Invite Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-gradient-to-br from-[#111e18]/90 
                     via-[#163321]/80 to-[#1a3a29]/85 border border-yellow-400/20 
                     rounded-2xl shadow-[0_0_30px_rgba(255,255,150,0.1)]
                     p-8 sm:p-10 backdrop-blur-xl overflow-hidden"
        >
          {/* Top holo line */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-[1px] 
                       bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
          />

          <InviteForm
            onSuccess={() => {
              setShowPopup(true);
              setTimeout(() => setShowPopup(false), 2000);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 4000);
            }}
          />
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-sm text-yellow-200/70 italic tracking-wide select-none"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Invites are logged automatically in your audit history.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default InviteMembers;
