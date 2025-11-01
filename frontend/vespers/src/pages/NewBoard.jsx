import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ActionDonePopup from "../components/ActionDonePopup"; // ✅ popup import

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white py-16 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated Backgrounds */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full"
      />

      {/* Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-8"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        }}
      >
        <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white mb-6">
          Create New Board
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-emerald-200/80 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-emerald-200/80 mb-1">Description</label>
            <div
              className="rounded-xl bg-white/5 border border-white/10 focus-within:border-emerald-400 transition"
              style={{ maxHeight: "160px", overflowY: "auto" }}
            >
              <textarea
                rows={4}
                placeholder="Describe your board..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="custom-scrollbar w-full px-4 py-2.5 bg-transparent text-white placeholder-emerald-200/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-rose-400 text-sm text-center bg-rose-900/20 py-2 rounded-md">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-3 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Board"}
          </button>
        </form>

        <button
          onClick={() => navigate("/boards")}
          className="mt-6 w-full text-emerald-300/80 hover:text-emerald-200 text-sm underline transition"
        >
          ← Back to Boards
        </button>
      </motion.div>

      {/* ✅ Success popup */}
      <ActionDonePopup show={showPopup} message="Board created successfully!" />
    </div>
  );
}
