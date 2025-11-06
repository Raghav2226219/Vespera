import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import ArchiveBoardCard from "../components/ArchiveBoardCard";
import ArchiveHeader from "../components/ArchiveHeader";
import Toast from "../components/Toast"; // ✅ added

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ArchivePage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Toast state (global)
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8 overflow-y-visible">
      {/* ✅ Global Toast */}
      <Toast show={showToast} message={toastMessage} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto relative"
      >
        <ArchiveHeader
          title="Archived Boards"
          subtitle="View and manage your archived boards"
          sortOption={sortOption}
          setSortOption={setSortOption}
          search={search}
          setSearch={setSearch}
        />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
            {filteredBoards.map((b) => (
              <ArchiveBoardCard
                key={b._id || b.id}
                board={b}
                onActionComplete={handleActionComplete}
                showToastMessage={showToastMessage} // ✅ pass down
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ArchivePage;
