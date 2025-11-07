import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ActionDonePopup from "../components/ActionDonePopup";

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function NewBoard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api.post("/board/create", { title, description });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/boards");
      }, 1800);
    } catch (err) {
      console.error("Error creating board:", err);
      setError(err.response?.data?.message || "Failed to create board.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center 
                 bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] 
                 text-white relative overflow-hidden no-scrollbar"
    >
      {/* 🌌 Animated holo glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -40, 0], y: [0, -25, 25, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[28rem] h-[28rem] bg-yellow-400/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 40, 0], y: [0, 25, -25, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[15%] w-[30rem] h-[30rem] bg-lime-400/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-lime-300/30 to-transparent"
        />
      </div>

      {/* 🧾 Form Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-[90%] max-w-md p-8 sm:p-10 
                   rounded-2xl border border-yellow-400/25 
                   backdrop-blur-2xl bg-gradient-to-br from-[#0f1e18]/90 via-[#183221]/85 to-[#1a3a29]/85 
                   shadow-[0_0_40px_rgba(255,255,150,0.15)]"
      >
        {/* ✨ Top holo line */}
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />

        <h1
          className="text-4xl font-extrabold text-center bg-clip-text text-transparent 
                     bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-200 
                     drop-shadow-[0_0_20px_rgba(255,255,150,0.25)] mb-6"
        >
          Create New Board
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-yellow-200/80 mb-2 text-sm font-medium">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter board title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-yellow-400/30 
                           text-yellow-100 placeholder-yellow-300/40
                           focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                           focus:border-yellow-400/50 backdrop-blur-md shadow-inner transition-all duration-300"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-yellow-200/80 mb-2 text-sm font-medium">
              Description
            </label>
            <div
              className="rounded-xl bg-white/10 border border-yellow-400/30 focus-within:border-yellow-400/50 transition-all"
              style={{ maxHeight: "160px", overflowY: "auto" }}
            >
              <textarea
                rows={4}
                placeholder="Describe your board..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="custom-scrollbar w-full px-4 py-3 bg-transparent text-yellow-100 placeholder-yellow-300/40 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-yellow-300 text-center text-sm bg-yellow-400/10 border border-yellow-400/20 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-gray-900
                       bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                       hover:from-yellow-200 hover:to-lime-200 transition-all duration-300
                       shadow-[0_0_25px_rgba(255,255,150,0.25)] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Board"}
          </motion.button>
        </form>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={() => navigate("/boards")}
          className="mt-6 w-full text-sm text-yellow-200/80 hover:text-yellow-100 transition-all underline decoration-yellow-200/40"
        >
          ← Back to Boards
        </motion.button>
      </motion.div>

      {/* ✅ Success popup */}
      <ActionDonePopup show={showPopup} message="Board created successfully!" />
    </div>
  );
}
