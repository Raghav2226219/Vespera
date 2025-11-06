import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, UserPlus, Hash } from "lucide-react";
import api from "../api/axios";

const InviteForm = ({ onSuccess }) => {
  const [boardId, setBoardId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      const res = await api.post(`/invites/${boardId}`, { email, role }, { withCredentials: true });
      setMessage({ type: "success", text: res.data.message });
      setEmail("");
      setRole("Viewer");
      setBoardId("");
      onSuccess();
    } catch (err) {
      console.error("Error sending invite:", err);
      const errMsg =
        err.response?.data?.message ||
        "Failed to send invite. Please try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-lg w-full bg-white/5 backdrop-blur-xl border border-emerald-400/20 
                 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.25)] p-10"
    >
      <motion.form
        onSubmit={handleInvite}
        className="space-y-6"
        initial="hidden"
        animate="visible"
      >
        {/* Board ID Input */}
        <motion.div variants={formItemVariants} custom={2}>
          <label className="block text-emerald-300 font-medium mb-2">
            Board ID
          </label>
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
                         transition-all duration-300
                         [appearance:textfield] 
                         [&::-webkit-outer-spin-button]:appearance-none 
                         [&::-webkit-inner-spin-button]:appearance-none 
                         overflow-hidden"
            />
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div variants={formItemVariants} custom={3}>
          <label className="block text-emerald-300 font-medium mb-2">
            Member Email
          </label>
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
                         transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Role Selector */}
        <motion.div variants={formItemVariants} custom={4}>
          <label className="block text-emerald-300 font-medium mb-2">
            Assign Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-emerald-400/20 
                       text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                       transition duration-300"
          >
            <option value="Viewer" className="text-black">
              Viewer
            </option>
            <option value="Editor" className="text-black">
              Editor
            </option>
            <option value="Owner" className="text-black">
              Owner
            </option>
          </select>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={formItemVariants}
          custom={5}
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
      </motion.form>

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
    </motion.div>
  );
};

export default InviteForm;
