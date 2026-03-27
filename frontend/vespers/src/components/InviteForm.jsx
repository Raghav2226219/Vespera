// src/components/InviteForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, UserPlus, Hash } from "lucide-react";
import api from "../api/axios";

const InviteForm = ({ onSuccess }) => {
  // Replace old boardId state and handle boards fetching
  const [boardId, setBoardId] = useState("");
  const [boards, setBoards] = useState([]);
  const [showBoards, setShowBoards] = useState(false);
  
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showRoles, setShowRoles] = useState(false);

  // Fetch Boards for Dropdown
  React.useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/board/all", { withCredentials: true });
        setBoards(Array.isArray(res.data) ? res.data : res.data.boards || []);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };
    fetchBoards();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!boardId) {
      setMessage({ type: "error", text: "Please select a board" });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        `/invites/${boardId}`,
        { email, role },
        { withCredentials: true }
      );
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
      transition: { delay: i * 0.12, duration: 0.45 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-lg w-full overflow-hidden 
                 rounded-2xl border border-yellow-400/25 
                 bg-gradient-to-br from-[#0b1914]/90 via-[#132d1f]/85 to-[#1a3a29]/85
                 shadow-[0_0_30px_rgba(255,255,150,0.12)] backdrop-blur-xl p-10 select-none"
    >
      {/* ✨ Animated ambient glow (contained) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-lime-400/10 to-transparent blur-[80px] pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.form
        onSubmit={handleInvite}
        className="space-y-6 relative z-10"
        initial="hidden"
        animate="visible"
      >
        {/* 🪄 Board Selection Dropdown */}
        <motion.div variants={formItemVariants} custom={1}>
          <label className="block text-yellow-300 font-semibold mb-2">
            Select Board
          </label>
          
          <div
            className="relative"
            onMouseEnter={() => clearTimeout(window.closeBoardTimer)}
            onMouseLeave={() => {
              window.closeBoardTimer = setTimeout(() => setShowBoards(false), 200);
            }}
          >
            {/* Dropdown Button */}
            <motion.button
              type="button"
              onClick={() => setShowBoards((prev) => !prev)}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                         bg-gradient-to-r from-lime-950/50 via-emerald-950/30 to-yellow-950/30
                         border border-yellow-400/30 text-lime-100 font-medium
                         shadow-inner shadow-lime-900/30 backdrop-blur-md
                         hover:shadow-[0_0_15px_rgba(255,255,150,0.25)]
                         focus:outline-none transition-all duration-300"
            >
              <div className="flex items-center gap-3 truncate">
                <Hash className="w-5 h-5 text-yellow-300/70 shrink-0" />
                <span className="truncate">
                  {boardId
                    ? boards.find((b) => String(b.id) === String(boardId))?.title || "Board Not Found"
                    : "Choose a Board"}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-yellow-300/80 transition-transform duration-300 shrink-0 ${
                  showBoards ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* Dropdown List */}
            <AnimatePresence>
              {showBoards && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute mt-2 w-full bg-gradient-to-b from-[#0b1914]/95 via-[#132d1f]/90 to-[#1a3a29]/95
                             border border-yellow-400/25 rounded-xl backdrop-blur-2xl 
                             shadow-[0_0_25px_rgba(255,255,150,0.15)] overflow-hidden z-[999]
                             max-h-60 overflow-y-auto no-scrollbar"
                >
                  {boards.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-yellow-200/50 italic text-center">
                      No active boards available
                    </li>
                  ) : (
                    boards.map((b) => (
                      <motion.li
                        key={b.id}
                        onClick={() => {
                          setBoardId(b.id);
                          setShowBoards(false);
                        }}
                        whileHover={{ scale: 1.01 }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 truncate ${
                          String(boardId) === String(b.id)
                            ? "bg-gradient-to-r from-lime-400/30 to-yellow-300/30 text-yellow-200"
                            : "text-lime-100 hover:bg-white/10 hover:text-yellow-100"
                        }`}
                      >
                        {b.title}
                      </motion.li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ✉️ Email Input */}
        <motion.div variants={formItemVariants} custom={2}>
          <label className="block text-yellow-300 font-semibold mb-2">
            Member Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/70 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="Enter member’s email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl 
                         bg-white/10 border border-yellow-400/30
                         text-lime-100 placeholder-yellow-200/50
                         focus:outline-none focus:ring-2 focus:ring-yellow-400/60 
                         focus:border-yellow-400/50 backdrop-blur-md
                         transition-all duration-300 shadow-inner"
            />
          </div>
        </motion.div>

        {/* 👥 Role Dropdown */}
        <motion.div variants={formItemVariants} custom={3}>
          <label className="block text-yellow-300 font-semibold mb-2">
            Assign Role
          </label>

          <div
            className="relative"
            onMouseEnter={() => clearTimeout(window.closeDropdownTimer)}
            onMouseLeave={() => {
              window.closeDropdownTimer = setTimeout(() => setShowRoles(false), 200);
            }}
          >
            {/* Dropdown Button */}
            <motion.button
              type="button"
              onClick={() => setShowRoles((prev) => !prev)}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                         bg-gradient-to-r from-lime-950/50 via-emerald-950/30 to-yellow-950/30
                         border border-yellow-400/30 text-lime-100 font-medium
                         shadow-inner shadow-lime-900/30 backdrop-blur-md
                         hover:shadow-[0_0_15px_rgba(255,255,150,0.25)]
                         focus:outline-none transition-all duration-300"
            >
              {role}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-yellow-300/80 transition-transform duration-300 ${
                  showRoles ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* Dropdown List */}
            <AnimatePresence>
              {showRoles && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute mt-2 w-full bg-gradient-to-b from-[#0b1914]/90 via-[#132d1f]/85 to-[#1a3a29]/85
                             border border-yellow-400/25 rounded-xl backdrop-blur-2xl 
                             shadow-[0_0_25px_rgba(255,255,150,0.15)] overflow-hidden z-[999]"
                >
                  {["Viewer", "Editor", "Owner"].map((opt) => (
                    <motion.li
                      key={opt}
                      onClick={() => {
                        setRole(opt);
                        setShowRoles(false);
                      }}
                      whileHover={{ scale: 1.03 }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                        role === opt
                          ? "bg-gradient-to-r from-lime-400/30 to-yellow-300/30 text-yellow-200"
                          : "text-lime-100 hover:bg-white/10 hover:text-yellow-100"
                      }`}
                    >
                      {opt}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Holo Underline */}
          <motion.div
            className="mt-2 w-24 h-[2px] rounded-full bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* 🚀 Submit Button */}
        <motion.button
          variants={formItemVariants}
          custom={4}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold
                     bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300
                     hover:from-yellow-200 hover:to-lime-200
                     text-gray-900 transition-all duration-300 
                     shadow-[0_0_25px_rgba(255,255,150,0.3)]
                     disabled:opacity-70 disabled:cursor-not-allowed"
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
            message.type === "success"
              ? "text-lime-300 drop-shadow-[0_0_10px_rgba(255,255,150,0.3)]"
              : "text-yellow-400/90"
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InviteForm;
