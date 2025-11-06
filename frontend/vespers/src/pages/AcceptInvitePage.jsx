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

        showToast("✅ Invite accepted successfully!");
        setStatus("success");

        // 3️⃣ Redirect after short delay
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
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white">
        {/* Animated gradient overlay */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15),transparent_70%)] blur-2xl"
        />

        {/* Error card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 px-10 py-12 max-w-md text-center rounded-3xl border border-rose-400/20 
                     bg-gray-900/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,63,94,0.2)]"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-transparent"
          >
            Invite Error
          </motion.h2>
          <p className="text-rose-200 mb-8 leading-relaxed">
            This invite is invalid, expired, or no longer available.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white shadow-lg transition"
          >
            Return Home
          </motion.button>
        </motion.div>
      </div>
    );

  // ✅ Success or awaiting login
  if (status === "success" && invite)
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white overflow-hidden">
        {/* Animated ambient light */}
        <motion.div
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_70%)] blur-2xl"
        />

        <Toast show={toast.show} message={toast.message} />

        {/* Floating glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full text-center p-10 rounded-3xl border border-emerald-400/20 
                     bg-gradient-to-br from-gray-900/60 via-emerald-950/40 to-gray-900/60 
                     shadow-[0_0_70px_rgba(16,185,129,0.3)] backdrop-blur-2xl"
        >
          <motion.h1
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-200 bg-clip-text mb-5"
          >
            Invite Accepted 🌿
          </motion.h1>

          <p className="text-emerald-100 mb-6 leading-relaxed text-lg">
            You’ve successfully joined{" "}
            <span className="font-semibold text-cyan-300">{invite.boardTitle}</span> as{" "}
            <span className="text-yellow-300 font-semibold">{invite.role}</span>.
          </p>

          <p className="text-emerald-200/70 text-sm">
            Redirecting you to your board workspace...
          </p>
        </motion.div>

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
