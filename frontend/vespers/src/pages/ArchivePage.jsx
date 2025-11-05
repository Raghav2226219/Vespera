import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import ArchiveBoardCard from "../components/ArchiveBoardCard";
import ArchiveHeader from "../components/ArchiveHeader";

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const ArchivePage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8 overflow-y-auto">
      {/* ✅ Header */}
      <ArchiveHeader
        title="Archived Boards"
        subtitle="View and manage your archived boards"
        sortOption={sortOption}
        setSortOption={setSortOption}
        search={search}
        setSearch={setSearch}
      />

      {/* ✅ Cards Section (matching BoardPage column layout) */}
      {loading ? (
        <div className="text-center py-24 text-emerald-200/80 text-lg">
          Loading archived boards…
        </div>
      ) : error ? (
        <div className="text-center py-8 text-rose-300 bg-rose-900/20 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="text-center text-emerald-200/70 mt-16 text-lg">
          No archived boards found.
        </div>
      ) : (
        <motion.div
          layout
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap md:flex-nowrap justify-start gap-6 md:gap-8 pl-6 md:pl-12 lg:pl-24 pr-4 md:pr-6 pb-8"
        >
          <AnimatePresence>
            {filteredBoards.map((b) => (
              <motion.div
                key={b._id || b.id}
                layout
                className="flex-shrink-0 w-[290px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
              >
                <ArchiveBoardCard
                  board={b}
                  onActionComplete={handleActionComplete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ArchivePage;
