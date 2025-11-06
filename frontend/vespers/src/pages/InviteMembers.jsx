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
      >
        {/* ✅ Reusable Toast */}
        <Toast show={showToast} message="Invite sent successfully!" />

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
