import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import TrashBoardCard from "../components/TrashBoardCard";
import TrashHeader from "../components/TrashHeader";
import Toast from "../components/Toast";

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const TrashPage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // ✅ Fetch trashed boards
  useEffect(() => {
    const fetchTrashedBoards = async () => {
      try {
        const res = await api.get("/board/trashed/all");
        const data = Array.isArray(res.data) ? res.data : res.data.boards || [];
        setBoards(data);
        setFilteredBoards(data);
      } catch (err) {
        console.error("Error fetching trashed boards:", err);
        setError("Failed to load trashed boards.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrashedBoards();
  }, []);

  // ✅ Search + Sort
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
    }, 300);
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
          (a, b) => new Date(b.trashedAt) - new Date(a.trashedAt)
        );
      case "oldest":
        return [...boards].sort(
          (a, b) => new Date(a.trashedAt) - new Date(b.trashedAt)
        );
      default:
        return boards;
    }
  };

  const handleActionComplete = (boardId) => {
    setBoards((prev) =>
      prev.filter((b) => b._id !== boardId && b.id !== boardId)
    );
    setFilteredBoards((prev) =>
      prev.filter((b) => b._id !== boardId && b.id !== boardId)
    );
  };

  return (
    <div
      className="relative min-h-screen w-full 
                 bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29]
                 text-white p-4 md:p-8 overflow-hidden no-scrollbar"
    >
      {/* 🌌 Animated Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -25, 25, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[15%] w-[28rem] h-[28rem] bg-yellow-400/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 25, -25, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] w-[30rem] h-[30rem] bg-lime-400/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-lime-300/30 to-transparent"
        />
      </div>

      {/* ✅ Toast */}
      <Toast show={showToast} message={toastMessage} />

      {/* 🧩 Main Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto relative z-10"
      >
        <TrashHeader
          search={search}
          setSearch={setSearch}
          sortOption={sortOption}
          setSortOption={setSortOption}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {/* ✅ Status States */}
        {loading ? (
          <div className="text-center py-24 text-yellow-200/80 text-lg">
            Loading trashed boards…
          </div>
        ) : error ? (
          <div className="text-center py-8 text-yellow-300 bg-yellow-900/20 rounded-lg max-w-md mx-auto border border-yellow-400/30">
            {error}
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center text-yellow-200/70 mt-16 text-lg">
            No trashed boards found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
            {filteredBoards.map((b) => (
              <TrashBoardCard
                key={b._id || b.id}
                board={b}
                onActionComplete={handleActionComplete}
                showToastMessage={showToastMessage}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* ✨ Bottom Glow Line */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
      />
    </div>
  );
};

export default TrashPage;
