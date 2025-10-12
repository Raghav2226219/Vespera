import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function BoardCard({ board, onOpen }) {
  return (
    <motion.div
      onClick={() => onOpen(board)}
      whileHover={{ rotateX: 8, rotateY: -8, scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="relative group w-64 h-44 md:w-72 md:h-48 cursor-pointer"
      style={{ perspective: 1000 }}
    >
      {/* Glass Card */}
      <motion.div
        className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between 
                   backdrop-blur-xl bg-white/10 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]
                   transition-all duration-500 group-hover:bg-white/15 group-hover:border-emerald-300/40"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white drop-shadow-sm">
            {board.title}
          </h3>
        </div>

        <p className="text-sm text-white/70 line-clamp-2">
          {board.description || "No description available."}
        </p>

        {/* Glow Border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 blur-[2px]" />
      </motion.div>

      {/* Ambient Shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-emerald-400/10 blur-2xl rounded-full" />
    </motion.div>
  );
}

export default function ViewBoards() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/board/all");
        setBoards(Array.isArray(res.data) ? res.data : res.data.boards || []);
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError("Failed to load boards. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const openBoard = (board) => {
    navigate(`/boards/${board._id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white py-12 px-6 overflow-x-hidden relative">
      {/* Ambient Glow Backgrounds */}
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

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-10 backdrop-blur-lg bg-white/5 px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
              Your Boards
            </h1>
            <p className="text-emerald-200/80 mt-1 text-sm">
              Manage and explore your boards in 3D space
            </p>
          </div>

          <button
            onClick={() => navigate("/newboard")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.05] transition"
          >
            + New Board
          </button>
        </header>

        {/* Board Grid */}
        {loading ? (
          <div className="text-center py-24 text-emerald-200/80 text-lg">
            Loading boards…
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-300 bg-rose-900/20 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center text-emerald-200/70 mt-16 text-lg">
            No boards yet — create your first board.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
            {boards.map((b) => (
              <BoardCard key={b._id} board={b} onOpen={openBoard} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
