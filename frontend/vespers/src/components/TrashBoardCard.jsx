import { motion } from "framer-motion";
import api from "../api/axios";
import { useState } from "react";

const TrashBoardCard = ({ board, onActionComplete }) => {
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 🟢 Restore board
  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await api.patch(`/board/${id}/restore`);
      onActionComplete?.(id); // remove instantly
    } catch (err) {
      console.error("Restore failed:", err);
      alert(err.response?.data?.message || "Failed to restore board");
    } finally {
      setRestoringId(null);
    }
  };

  // 🔴 Permanently delete board
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this board?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/board/${id}/permanent`);
      onActionComplete?.(id); // remove instantly
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete board");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      key={board._id || board.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{
        rotateX: 4,
        rotateY: -4,
        y: -6,
        scale: 1.03,
      }}
      style={{ perspective: 1000 }}
      className="relative group w-80 h-56 md:w-88 md:h-60 cursor-pointer select-none"
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-400/20 via-cyan-400/10 to-transparent opacity-40 blur-md"
        whileHover={{ opacity: 0.7, scale: 1.05 }}
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 h-full w-full rounded-3xl p-6 flex flex-col justify-between overflow-hidden
                   border border-emerald-400/20 backdrop-blur-xl
                   bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900
                   shadow-[0_0_25px_rgba(0,0,0,0.6)]
                   group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]
                   transition-all duration-700 ease-out"
      >
        {/* Border shimmer */}
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-3xl border border-emerald-400/30 pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <motion.h3
              className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text
                         bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200
                         drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]
                         transition-transform duration-500"
              whileHover={{ scale: 1.06 }}
            >
              {board.title}
            </motion.h3>

            <p className="text-sm text-white/80 mt-2 line-clamp-2 leading-snug">
              {board.description || "No description available."}
            </p>
          </div>

          <div className="text-xs text-emerald-200/80 mt-4">
            🗑 Trashed on{" "}
            <span className="text-emerald-300">
              {new Date(board.trashedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 flex items-center justify-center gap-5 bg-black/25 backdrop-blur-[1px] rounded-3xl"
        >
          {/* Restore Button */}
          <motion.button
            disabled={!!restoringId || !!deletingId}
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(board._id || board.id);
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className={`px-5 py-2.5 rounded-xl font-semibold shadow-md
                       bg-gradient-to-r from-emerald-700 to-cyan-700
                       hover:from-emerald-600 hover:to-cyan-600
                       text-white transition-all duration-300
                       hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]
                       ${
                         restoringId === (board._id || board.id)
                           ? "opacity-70 cursor-wait"
                           : ""
                       }`}
          >
            ♻{" "}
            {restoringId === (board._id || board.id)
              ? "Restoring..."
              : "Restore"}
          </motion.button>

          {/* Delete Button */}
          <motion.button
            disabled={!!restoringId || !!deletingId}
            onClick={(e) => {
              e.stopPropagation();
              handlePermanentDelete(board._id || board.id);
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className={`px-5 py-2.5 rounded-xl font-semibold shadow-md
                       bg-gradient-to-r from-red-700 to-yellow-600
                       hover:from-red-600 hover:to-yellow-500
                       text-white transition-all duration-300
                       hover:shadow-[0_0_14px_rgba(255,120,60,0.4)]
                       ${
                         deletingId === (board._id || board.id)
                           ? "opacity-70 cursor-wait"
                           : ""
                       }`}
          >
            🗑{" "}
            {deletingId === (board._id || board.id)
              ? "Deleting..."
              : "Delete"}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom Glow */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-44 h-8 bg-emerald-400/20 blur-3xl rounded-full"
        whileHover={{ opacity: 1, scale: 1.2, blur: "40px" }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default TrashBoardCard;
