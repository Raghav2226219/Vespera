import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import api from "../api/axios";

// ✅ Dropdown rendered via portal
const DropdownPortal = ({ rect, children }) => {
  if (!rect) return null;
  const style = {
    position: "absolute",
    top: rect.bottom + window.scrollY + 8,
    left: rect.right + window.scrollX - 160,
    zIndex: 9999,
  };
  return createPortal(<div style={style}>{children}</div>, document.body);
};

const ArchiveBoardCard = ({ board, onActionComplete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [btnRect, setBtnRect] = useState(null);
  const menuButtonRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  // ✅ Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      if (menuButtonRef.current) {
        setBtnRect(menuButtonRef.current.getBoundingClientRect());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    const rect = menuButtonRef.current?.getBoundingClientRect();
    setBtnRect(rect || null);
    setMenuOpen((prev) => !prev);
  };

  // ✅ Handle restore & delete actions
  const handleMenuAction = async (action) => {
    setMenuOpen(false);
    if (processing) return;

    const id = board._id || board.id;

    if (action === "restore") {
      try {
        setProcessing(true);
        await api.patch(`/board/${id}/restore`);
        onActionComplete?.(id);
      } catch (err) {
        console.error("Restore failed:", err);
        alert(err.response?.data?.message || "Failed to restore board");
      } finally {
        setProcessing(false);
      }
    }

    if (action === "delete") {
      if (!window.confirm("Are you sure you want to permanently delete this board?")) return;
      try {
        setProcessing(true);
        await api.delete(`/board/${id}/permanent`);
        onActionComplete?.(id);
      } catch (err) {
        console.error("Delete failed:", err);
        alert(err.response?.data?.message || "Failed to delete board");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
      whileHover={{
        rotateX: 4,
        rotateY: -4,
        y: -6,
        scale: 1.04,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 16,
      }}
      className="relative group w-80 h-56 md:w-88 md:h-60 cursor-pointer select-none"
      style={{ perspective: 1000 }}
    >
      {/* Ambient Halo */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-400/30 via-cyan-400/20 to-transparent opacity-40 blur-xl transition-all duration-700"
        whileHover={{ opacity: 0.9, scale: 1.05 }}
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 h-full w-full rounded-3xl p-6 flex flex-col justify-between overflow-hidden
                 border border-emerald-400/20 backdrop-blur-2xl
                 bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900
                 shadow-[0_0_25px_rgba(0,0,0,0.6)]
                 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]
                 transition-all duration-700 ease-out"
      >
        {/* Animated border pulse */}
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-3xl border border-emerald-400/30 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Title and Menu */}
          <div className="flex justify-between items-start">
            <motion.h3
              className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text
                       bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200
                       drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]
                       transition-transform duration-500"
              whileHover={{ scale: 1.07 }}
            >
              {board.title}
            </motion.h3>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="p-1.5 rounded-full hover:bg-emerald-400/20 transition-colors duration-300"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Board actions"
              >
                <MoreVertical className="w-5 h-5 text-emerald-300" />
              </button>
            </div>
          </div>

          <p className="text-sm text-white/80 mt-2 line-clamp-2 leading-snug">
            {board.description || "No description provided."}
          </p>

          <div className="text-xs text-emerald-200/80 mt-4">
            🗓 Archived on{" "}
            <span className="text-emerald-300">
              {new Date(board.archivedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Glow */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-44 h-8 bg-emerald-400/20 blur-3xl rounded-full"
        whileHover={{ opacity: 1, scale: 1.2, blur: "40px" }}
        transition={{ duration: 0.6 }}
      />

      {/* ✅ Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <DropdownPortal rect={btnRect}>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-44 rounded-xl bg-gray-900/95 border border-emerald-400/20 shadow-xl backdrop-blur-md z-50 overflow-hidden"
            >
              <button
                disabled={processing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuAction("restore");
                }}
                className="w-full text-left px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 transition"
              >
                ♻ Restore
              </button>
              <button
                disabled={processing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuAction("delete");
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
              >
                🗑 Delete Permanently
              </button>
            </motion.div>
          </DropdownPortal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArchiveBoardCard;
