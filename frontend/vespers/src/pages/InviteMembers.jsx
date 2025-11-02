import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, UserPlus, ArrowLeft, Hash, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ActionDonePopup from "../components/ActionDonePopup"; // ✅ Import popup

const InviteMembers = () => {
  const navigate = useNavigate();

  const [boardId, setBoardId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState(false); // ✅ Separate state for toast

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!boardId) {
      setMessage({ type: "error", text: "Board ID required" });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(`/invites/${boardId}`, { email, role });
      setMessage({ type: "success", text: res.data.message });
      setEmail("");
      setRole("Viewer");
      setBoardId("");

      // ✅ Show popup for 2 seconds
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);

      // ✅ Show toast for 5 seconds
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (err) {
      console.error("Error sending invite:", err);
      const errMsg =
        err.response?.data?.message || "Failed to send invite. Please try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 px-4 py-10 relative"
    >
      {/* ✅ Toast (5 seconds) */}
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

      {/* ✅ Full-screen Popup (2 seconds) */}
      <ActionDonePopup
        message="Invite successfully sent!"
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />

      {/* Main Form */}
      <div className="max-w-lg w-full bg-white/5 backdrop-blur-xl border border-emerald-400/20 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.25)] p-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
            Invite Members
          </h1>
        </div>

        <p className="text-emerald-200/80 mb-8 text-sm leading-relaxed">
          Send invitations to team members to collaborate on this board.
          Only <span className="text-emerald-400 font-semibold">Owners</span> or{" "}
          <span className="text-emerald-400 font-semibold">Admins</span> can send invites.
        </p>

        <form onSubmit={handleInvite} className="space-y-6">
          {/* Board ID Input */}
          <div>
            <label className="block text-emerald-300 font-medium mb-2">Board ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/60 w-5 h-5" />
              <input
                type="number"
                required
                placeholder="Enter board ID"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-emerald-400/20
                           text-emerald-100 placeholder-emerald-300/40
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50
                           focus:bg-white/10 autofill:bg-transparent autofill:text-emerald-100
                           transition-all duration-300"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-emerald-300 font-medium mb-2">Member Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/60 w-5 h-5" />
              <input
                type="email"
                required
                placeholder="Enter member’s email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-emerald-400/20
                           text-emerald-100 placeholder-emerald-300/40
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50
                           focus:bg-white/10 autofill:bg-transparent autofill:text-emerald-100
                           transition-all duration-300"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-emerald-300 font-medium mb-2">Assign Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-emerald-400/20 
                         text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                         transition duration-300"
            >
              <option value="Viewer" className="text-black">Viewer</option>
              <option value="Editor" className="text-black">Editor</option>
              <option value="Owner" className="text-black">Owner</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg
                       bg-gradient-to-r from-cyan-400 to-emerald-400
                       hover:from-cyan-300 hover:to-emerald-300
                       text-gray-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Sending Invite..." : "Send Invite"}
          </motion.button>
        </form>

        {/* Feedback Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center font-medium ${
              message.type === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InviteMembers;
