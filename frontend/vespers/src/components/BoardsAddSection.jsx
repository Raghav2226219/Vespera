import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, LayoutDashboard } from "lucide-react";
import api from "../api/axios";
import BoardCard from "./BoardCard";
import VesperaMiniHolo from "../components/VesperaMiniHolo"; // ✅ added holo

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
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

  const openBoard = (board) => navigate(`/board/${board.id}`);

  const handleBoardTrashed = (boardId) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setFilteredBoards((prev) => prev.filter((b) => b.id !== boardId));
  };

  const handleDashboard = () => navigate("/dashboard");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto relative"
    >
      {/* 🌌 Header Section with Holo */}
      <header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 
                   backdrop-blur-lg bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-emerald-900/50 
                   px-6 py-5 rounded-2xl border border-lime-400/20 
                   shadow-[0_0_25px_rgba(255,255,150,0.12)] relative z-[50]"
      >
        {/* Left Section — Holo + Text */}
        <div className="flex items-center gap-4">
          <div className="scale-90 sm:scale-100">
            <VesperaMiniHolo size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent 
                           bg-gradient-to-r from-lime-300 via-yellow-300 to-white 
                           drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]">
              Your Boards
            </h1>
            <p className="text-lime-200/80 mt-1 text-sm">
              Manage and explore your boards in 3D space
            </p>
            <motion.div
              className="mt-2 w-32 h-[2px] rounded-full bg-gradient-to-r 
                         from-transparent via-yellow-300/70 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
          {/* Dashboard Button */}
          <motion.button
            onClick={handleDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium 
                       bg-gradient-to-r from-emerald-700 via-lime-500/80 to-yellow-400/70
                       text-gray-900 shadow-[0_0_20px_rgba(190,255,150,0.3)]
                       hover:shadow-[0_0_30px_rgba(255,255,150,0.45)] transition-all duration-300"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </motion.button>

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
                         bg-gradient-to-r from-lime-900/60 to-yellow-900/30 border border-lime-400/20
                         text-lime-100 font-medium backdrop-blur-md shadow-inner shadow-lime-900/30
                         hover:shadow-[0_0_12px_rgba(255,255,150,0.3)] hover:from-lime-800/70 hover:to-yellow-800/50
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
                  className="absolute mt-2 w-44 bg-gradient-to-b from-lime-950/95 via-lime-900/90 to-yellow-950/90 
                             border border-lime-400/30 rounded-xl backdrop-blur-2xl shadow-xl 
                             shadow-yellow-900/40 overflow-hidden z-[9999]"
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
                                     ? "bg-gradient-to-r from-lime-500/20 to-yellow-500/20 text-lime-300"
                                     : "text-lime-100 hover:bg-white/10 hover:text-yellow-200"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-300/70 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search boards..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-lime-400/20
                         text-lime-100 placeholder-lime-200/40
                         backdrop-blur-md shadow-inner
                         focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50
                         transition duration-300"
            />
          </div>

          {/* Create New Board */}
          <motion.button
            onClick={() => navigate("/newboard")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-xl font-semibold 
                       bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                       text-gray-900 shadow-[0_0_25px_rgba(255,255,150,0.3)] 
                       hover:shadow-[0_0_35px_rgba(255,255,150,0.5)] 
                       hover:from-yellow-200 hover:to-lime-200 transition-all duration-300"
          >
            + New Board
          </motion.button>
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
              onTrashed={() => handleBoardTrashed(b.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BoardsAddSection;
