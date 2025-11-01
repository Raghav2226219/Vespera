import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, LayoutDashboard } from "lucide-react"; // ✅ Added icon here
import api from "../api/axios";
import BoardCard from "./BoardCard";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const BoardsAddSection = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const closeTimeoutRef = useRef(null);

  // Fetch boards
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

  // Search + Sort filter
  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = [...boards];
      if (search.trim()) {
        const lower = search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title?.toLowerCase().includes(lower) ||
            b.description?.toLowerCase().includes(lower)
        );
      }
      filtered = sortBoards(filtered, sortOption);
      setFilteredBoards(filtered);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, boards, sortOption]);

  const sortBoards = (boards, option) => {
    switch (option) {
      case "az":
        return [...boards].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
      case "za":
        return [...boards].sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        );
      case "newest":
        return [...boards].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...boards].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return boards;
    }
  };

  const handleSort = (value) => {
    setSortOption(value);
    setDropdownOpen(false);
  };

  const openBoard = (board) => {
    navigate(`/board/${board.id}`);
  };

  // ✅ Remove board instantly when trashed
  const handleBoardTrashed = (boardId) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setFilteredBoards((prev) => prev.filter((b) => b.id !== boardId));
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto relative"
    >
      {/* Header */}
      <header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 
                   backdrop-blur-lg bg-white/5 px-6 py-4 rounded-2xl border border-white/10 
                   shadow-xl relative z-[50]"
      >
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
            Your Boards
          </h1>
          <p className="text-emerald-200/80 mt-1 text-sm">
            Manage and explore your boards in 3D space
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
          {/* ✅ Dashboard Button before Sort */}
          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md 
            bg-gradient-to-r from-gray-800 to-emerald-700
            hover:from-gray-700 hover:to-emerald-600 
            text-emerald-200 transition-all duration-300 hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          {/* Sort Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              closeTimeoutRef.current = setTimeout(() => {
                setDropdownOpen(false);
                closeTimeoutRef.current = null;
              }, 180);
            }}
          >
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center justify-between w-44 px-4 py-2.5 rounded-xl 
                         bg-gradient-to-r from-emerald-900/60 to-cyan-900/40 border border-emerald-400/20
                         text-emerald-100 font-medium backdrop-blur-md shadow-inner shadow-emerald-900/30
                         hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:from-emerald-800/70 hover:to-cyan-800/50
                         transition-all duration-300"
            >
              {sortOption === "default"
                ? "Sort: Default"
                : sortOption === "az"
                ? "Sort: A → Z"
                : sortOption === "za"
                ? "Sort: Z → A"
                : sortOption === "newest"
                ? "Newest First"
                : "Oldest First"}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute mt-2 w-44 bg-gradient-to-b from-emerald-950/95 via-emerald-900/90 to-cyan-950/90 
                             border border-emerald-400/30 rounded-xl backdrop-blur-2xl shadow-xl 
                             shadow-emerald-900/40 overflow-hidden z-[9999]"
                >
                  {[
                    { label: "Default", value: "default" },
                    { label: "A → Z", value: "az" },
                    { label: "Z → A", value: "za" },
                    { label: "Newest First", value: "newest" },
                    { label: "Oldest First", value: "oldest" },
                  ].map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => handleSort(opt.value)}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition 
                                 ${
                                   sortOption === opt.value
                                     ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300"
                                     : "text-emerald-100 hover:bg-white/10 hover:text-emerald-200"
                                 }`}
                    >
                      {opt.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 
                       text-gray-900 font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] 
                       hover:from-emerald-300 hover:to-cyan-300 hover:scale-[1.05] 
                       transition-all duration-300"
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
        <div className="relative z-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
          {filteredBoards.map((b) => (
            <BoardCard
              key={b.id}
              board={b}
              onOpen={openBoard}
              onTrashed={() => handleBoardTrashed(b.id)} // ✅ Auto remove when trashed
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BoardsAddSection;
