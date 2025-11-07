import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import ArchiveBoardCard from "../components/ArchiveBoardCard";
import ArchiveHeader from "../components/ArchiveHeader";
import Toast from "../components/Toast";

const ArchivePage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
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

  // ✅ Fetch archived boards
  useEffect(() => {
    const fetchArchivedBoards = async () => {
      try {
        const res = await api.get("/board/archived/all");
        const data = Array.isArray(res.data) ? res.data : res.data.boards || [];
        setBoards(data);
        setFilteredBoards(data);
      } catch (err) {
        console.error("Error fetching archived boards:", err);
        setError("Failed to load archived boards.");
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedBoards();
  }, []);

  // ✅ Search + Sort filter
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
          (a, b) => new Date(b.archivedAt) - new Date(a.archivedAt)
        );
      case "oldest":
        return [...boards].sort(
          (a, b) => new Date(a.archivedAt) - new Date(b.archivedAt)
        );
      default:
        return boards;
    }
  };

  // ✅ Remove instantly after action
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
      className="relative min-h-screen overflow-hidden 
                 bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] 
                 text-white px-4 md:px-8 py-6 md:py-10"
    >
      {/* ✨ Background aura + holo beams */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,160,0.08),transparent_70%)] blur-3xl animate-pulse" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent opacity-80 animate-pulse" />
      </div>

      {/* ✅ Global Toast */}
      <Toast show={showToast} message={toastMessage} />

      {/* ✅ Main Container (fixed animation to avoid scrollbar flicker) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative"
      >
        {/* 🟡 Header */}
        <ArchiveHeader
          title="Archived Boards"
          subtitle="View and manage your archived boards"
          sortOption={sortOption}
          setSortOption={setSortOption}
          search={search}
          setSearch={setSearch}
        />

        {/* 🌀 Loading / Error / Boards */}
        {loading ? (
          <div className="text-center py-24 text-yellow-200/80 text-lg tracking-wide">
            Loading archived boards…
          </div>
        ) : error ? (
          <div className="text-center py-8 px-6 bg-yellow-900/20 text-yellow-200 border border-yellow-400/20 rounded-lg max-w-md mx-auto shadow-[0_0_20px_rgba(255,255,150,0.15)]">
            {error}
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center text-yellow-200/70 mt-16 text-lg">
            No archived boards found.
          </div>
        ) : (
          <div
            className="relative mt-10 z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                       gap-10 justify-items-center"
          >
            {filteredBoards.map((b, i) => (
              <motion.div
                key={b._id || b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="w-full flex justify-center"
              >
                <ArchiveBoardCard
                  board={b}
                  onActionComplete={handleActionComplete}
                  showToastMessage={showToastMessage}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 💫 Floating yellow particles (contained to prevent scroll flicker) */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300/70 shadow-[0_0_8px_rgba(255,255,150,0.4)] pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * -80 - 20],
            opacity: [0, 1, 0],
            scale: [0.3, 1, 0.3],
          }}
          transition={{
            delay: Math.random() * 1.5,
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ArchivePage;
