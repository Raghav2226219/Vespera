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
  const hasRun = useRef(false); // ✅ Prevent duplicate runs

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  useEffect(() => {
    const processInvite = async () => {
      // ✅ Stop duplicate call (React Strict Mode or re-renders)
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        if (!token) {
          setStatus("error");
          return;
        }

        // 1️⃣ Validate the invite first
        const res = await api.get(`/invites/validate?token=${token}`, {
          withCredentials: true,
        });
        if (!res.data.valid) throw new Error(res.data.reason);
        setInvite(res.data);

        // 2️⃣ Attempt to accept invite (cookie auth auto-attached)
        const acceptRes = await api.post(
          "/invites/accept",
          { token },
          { withCredentials: true }
        );

        showToast("✅ Invite accepted successfully!");
        setStatus("success");

        // 3️⃣ Redirect logic (after a short delay)
        setTimeout(() => {
          navigate(`/board/${acceptRes.data.boardId}`);
        }, 1800);
      } catch (err) {
        console.error("Error accepting invite:", err);
        const statusCode = err.response?.status;

        if (statusCode === 401) {
          // User not logged in → show modal
          setShowModal(true);
          setStatus("success"); // hide loader
          showToast("🔒 Please login or register to accept the invite.");
          return;
        }

        if (statusCode === 403) {
          // Wrong user tried to accept
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

  // 🕓 While checking or processing
  if (status === "checking")
    return <InviteLoader message="Validating your invite..." />;

  // ❌ Invalid invite
  if (status === "error")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-rose-300 bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl border border-rose-400/20 backdrop-blur-xl bg-gray-900/50 shadow-[0_0_25px_rgba(244,63,94,0.3)] text-center"
        >
          <h2 className="text-3xl font-bold mb-2">Invite Error</h2>
          <p className="text-rose-200 mb-6">This invite is invalid or has expired.</p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );

  // ✅ Invite accepted or awaiting login
  if (status === "success" && invite)
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white overflow-hidden">
        {/* Background shimmer */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]"
        />

        <Toast show={toast.show} message={toast.message} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full text-center p-10 rounded-3xl border border-emerald-400/20 
                     bg-gradient-to-br from-gray-900/60 via-emerald-950/50 to-gray-900/60 
                     shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl"
        >
          <h1 className="text-4xl font-bold text-emerald-300 mb-4">
            Invite Accepted!
          </h1>
          <p className="text-emerald-100 mb-6 leading-relaxed">
            You’ve successfully joined{" "}
            <span className="font-semibold text-cyan-300">{invite.boardTitle}</span> as{" "}
            <span className="text-yellow-300 font-semibold">{invite.role}</span>.
          </p>
          <p className="text-emerald-200/70 text-sm">
            Redirecting you to the board...
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
