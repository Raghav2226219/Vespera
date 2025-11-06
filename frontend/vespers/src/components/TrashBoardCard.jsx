import { motion } from "framer-motion";
import api from "../api/axios";
import { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; 

const TrashBoardCard = ({ board, onActionComplete, showToastMessage }) => {
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🟢 Restore board
  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await api.patch(`/board/${id}/restore`);
      onActionComplete?.(id);
      showToastMessage("Board restored successfully!");
    } catch (err) {
      console.error("Restore failed:", err);
      showToastMessage("Failed to restore board");
    } finally {
      setRestoringId(null);
    }
  };

  // 🔴 Permanently delete board (triggered after confirm)
  const handlePermanentDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/board/${id}/permanent`);
      onActionComplete?.(id);
      showToastMessage("Board permanently deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      showToastMessage("Failed to delete board");
    } finally {
      setDeletingId(null);
    }
  };

  // 🧮 Countdown logic (15 days from trashedAt)
  useEffect(() => {
    if (!board.trashedAt) return;
    const trashedTime = new Date(board.trashedAt).getTime();
    const deleteAfter = trashedTime + 15 * 24 * 60 * 60 * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = deleteAfter - now;

      if (diff <= 0) {
        setTimeLeft("Deleting soon...");
        setIsCritical(true);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days >= 1) {
        setTimeLeft(`${days}d : ${hours}h`);
        setIsCritical(false);
      } else {
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}h : ${minutes
            .toString()
            .padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`
        );
        setIsCritical(true);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [board.trashedAt]);

  return (
    <>
      {/* ✅ Confirm Modal */}
      <ConfirmDeleteModal
        show={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          handlePermanentDelete(board._id || board.id);
        }}
        onCancel={() => setShowConfirm(false)}
      />

      {/* 🟩 Card */}
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

          {/* 🕒 Countdown Badge */}
          {timeLeft && (
            <motion.div
              animate={
                isCritical
                  ? { opacity: [1, 0.8, 1], scale: [1, 1.05, 1] }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                isCritical
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white 
                         border border-white/20 backdrop-blur-sm 
                         bg-gradient-to-r from-red-700 via-orange-600 to-yellow-500
                         shadow-[0_0_12px_rgba(255,80,50,0.5)]
                         flex items-center gap-1"
            >
              <span className="text-yellow-200/90">⚠</span>
              <span className="drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">
                Deleting in {timeLeft}
              </span>
            </motion.div>
          )}

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
                setShowConfirm(true);
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
    </>
  );
};

export default TrashBoardCard;
