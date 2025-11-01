import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import TrashBoardCard from "../components/TrashBoardCard";
import TrashHeader from "../components/TrashHeader";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const TrashPage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // ✅ Filtering + Sorting logic
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

  // ✅ Handle Restore/Delete instantly
  const handleRestore = async (boardId) => {
    try {
      await api.put(`/board/${boardId}/restore`);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error("Error restoring board:", err);
    }
  };

  const handleDelete = async (boardId) => {
    try {
      await api.delete(`/board/${boardId}/delete`);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8 overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto relative"
      >
        <TrashHeader
          search={search}
          setSearch={setSearch}
          sortOption={sortOption}
          setSortOption={setSortOption}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {loading ? (
          <div className="text-center py-24 text-emerald-200/80 text-lg">
            Loading trashed boards…
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-300 bg-rose-900/20 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center text-emerald-200/70 mt-16 text-lg">
            No trashed boards found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
            {filteredBoards.map((b) => (
              <TrashBoardCard
                key={b._id || b.id}
                board={b}
                onActionComplete={() => {
                  setBoards((prev) =>
                    prev.filter((board) => board._id !== b._id)
                  );
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrashPage;
