import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, Loader2, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const SuspendedPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleRequestUnsuspend = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for unsuspension.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/request-unsuspend", { reason });
      setSent(true);
    } catch (err) {
      console.error("Error requesting unsuspend:", err);
      alert("Failed to send request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await api.post("/user/logout", { refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050f0c]/80 backdrop-blur-md text-white p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full bg-[#0b1914] border border-red-500/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]"
      >
        <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Lock className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Account Suspended</h1>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Your account has been suspended. You cannot access the dashboard.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-left"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Request sent! Admins have been notified.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why should we unsuspend you?"
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 min-h-[100px]"
            />
            <button
              onClick={handleRequestUnsuspend}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" /> Ask to Unsuspend
                </>
              )}
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
        >
          Log out
        </button>
      </motion.div>
    </div>
  );
};

export default SuspendedPage;
