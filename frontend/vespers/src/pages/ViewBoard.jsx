import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "../api/axios";
import BoardCard from "../components/BoardCard"; // ✅ Imported separated component

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ViewBoards() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/board/all");
        const data = Array.isArray(res.data) ? res.data : res.data.boards || [];
        setBoards(data);
        setFilteredBoards(data);
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError("Failed to load boards. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // ✅ Debounced Search Effect (700ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setFilteredBoards(boards);
      } else {
        const lower = search.toLowerCase();
        const filtered = boards.filter(
          (b) =>
            b.title?.toLowerCase().includes(lower) ||
            b.description?.toLowerCase().includes(lower)
        );
        setFilteredBoards(filtered);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [search, boards]);

  // ✅ Navigation to board details
  const openBoard = (board) => {
    navigate(`/board/${board.id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white py-12 px-6 overflow-x-hidden relative">
      {/* Animated Backgrounds */}
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 backdrop-blur-lg bg-white/5 px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
              Your Boards
            </h1>
            <p className="text-emerald-200/80 mt-1 text-sm">
              Manage and explore your boards in 3D space
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/60 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search boards..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-emerald-400/20
                           text-emerald-100 placeholder-emerald-300/40
                           backdrop-blur-md shadow-inner
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50
                           transition duration-300"
              />
            </div>

            {/* Create New Board */}
            <button
              onClick={() => navigate("/newboard")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.05] transition"
            >
              + New Board
            </button>
          </div>
        </header>

        {/* Boards Grid */}
        {loading ? (
          <div className="text-center py-24 text-emerald-200/80 text-lg">
            Loading boards…
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-300 bg-rose-900/20 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center text-emerald-200/70 mt-16 text-lg">
            No matching boards found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
            {filteredBoards.map((b) => (
              <BoardCard key={b.id} board={b} onOpen={openBoard} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
