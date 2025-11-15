import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import GlassModal from "../components/GlassModal";
import Toast from "../components/Toast";
import InviteLoader from "../components/InviteLoader";

const AcceptInvitePage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | success | error
  const [invite, setInvite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const token = new URLSearchParams(window.location.search).get("token");
  const hasRun = useRef(false);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  useEffect(() => {
    const processInvite = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        if (!token) {
          setStatus("error");
          return;
        }

        // 1️⃣ Validate invite
        const res = await api.get(`/invites/validate?token=${token}`, {
          withCredentials: true,
        });
        if (!res.data.valid) throw new Error(res.data.reason);
        setInvite(res.data);

        // 2️⃣ Attempt to accept
        const acceptRes = await api.post(
          "/invites/accept",
          { token },
          { withCredentials: true }
        );

        showToast("✨ Invite accepted successfully!");
        setStatus("success");

        // 3️⃣ Redirect
        setTimeout(() => {
          navigate(`/board/${acceptRes.data.boardId}`);
        }, 1800);
      } catch (err) {
        console.error("Error accepting invite:", err);
        const statusCode = err.response?.status;

        if (statusCode === 401) {
          setShowModal(true);
          setStatus("success");
          showToast("🔒 Please login or register to accept the invite.");
          return;
        }

        if (statusCode === 403) {
          setStatus("error");
          showToast("⚠️ This invite was not meant for your account and has been cancelled.");
          return;
        }

        setStatus("error");
        showToast(err.response?.data?.message || "❌ Invalid or expired invite link.");
      }
    };

    processInvite();
  }, [token, navigate]);

  // 🌀 Loader
  if (status === "checking")
    return <InviteLoader message="Validating your invite..." />;

  // ❌ Error screen
  if (status === "error")
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#181a0f] to-[#1a1f0f] text-white">
        {/* ✨ Animated yellow aura */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,240,140,0.1),transparent_70%)] blur-3xl"
        />

        {/* 🌟 Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 px-10 py-12 max-w-md text-center rounded-3xl 
                     border border-yellow-400/20 
                     bg-gradient-to-br from-gray-950/70 via-yellow-950/20 to-gray-900/70 
                     backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,120,0.25)]"
        >
          <motion.h2
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-lime-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,150,0.4)]"
          >
            Invite Invalid
          </motion.h2>

          <p className="text-yellow-100/90 mb-8 leading-relaxed">
            This invite link is invalid, expired, or no longer available.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl font-semibold 
                       bg-gradient-to-r from-yellow-400 to-lime-400 
                       hover:from-yellow-300 hover:to-lime-300 
                       text-gray-900 shadow-[0_0_25px_rgba(255,255,150,0.4)] 
                       transition-all duration-300"
          >
            Return Home
          </motion.button>
        </motion.div>
      </div>
    );

  // ✅ Success screen
  if (status === "success" && invite)
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1914] via-[#122d1e] to-[#1a3a29] text-white">
        {/* ✨ Animated ambient holo glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,160,0.15),transparent_70%)] blur-3xl"
        />

        <Toast show={toast.show} message={toast.message} />

        {/* 🌿 Holo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full text-center p-10 rounded-3xl border border-yellow-400/20 
                     bg-gradient-to-br from-gray-900/70 via-lime-950/30 to-yellow-950/40 
                     shadow-[0_0_60px_rgba(255,255,150,0.25)] backdrop-blur-2xl"
        >
          {/* Holo shimmer border sweep */}
          <motion.div
            className="absolute top-0 left-[-40%] w-[60%] h-full bg-gradient-to-tr from-transparent via-yellow-200/10 to-transparent opacity-50"
            animate={{ x: ["-40%", "130%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.h1
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text mb-5 drop-shadow-[0_0_15px_rgba(255,255,150,0.35)]"
          >
            Invite Accepted ✨
          </motion.h1>

          <p className="text-yellow-100/90 mb-6 leading-relaxed text-lg">
            You’ve joined{" "}
            <span className="font-semibold text-lime-300">{invite.boardTitle}</span> as{" "}
            <span className="text-yellow-300 font-semibold">{invite.role}</span>.
          </p>

          <p className="text-yellow-200/70 text-sm">
            Redirecting you to your board workspace...
          </p>

          {/* Floating particles aura */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300/70 shadow-[0_0_10px_rgba(255,255,150,0.4)]"
              initial={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 120 - 60,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: [null, Math.random() * -50 - 20],
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
        </motion.div>

        {/* 🔐 Login/Register modal */}
        <GlassModal
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Join the board"
          description="Login if you already have an account or register if you're new."
        />
      </div>
    );

  return null;
};

export default AcceptInvitePage;
