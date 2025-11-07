import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import api from "../api/axios";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

// 🌌 Dropdown via Portal
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

const ArchiveBoardCard = ({ board, onActionComplete, showToastMessage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [btnRect, setBtnRect] = useState(null);
  const menuButtonRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    setMenuOpen((p) => !p);
  };

  const handleMenuAction = async (action) => {
    setMenuOpen(false);
    if (processing) return;

    const id = board._id || board.id;

    if (action === "restore") {
      try {
        setProcessing(true);
        await api.patch(`/board/${id}/restore`);
        onActionComplete?.(id);
        showToastMessage("Board restored successfully!");
      } catch (err) {
        console.error("Restore failed:", err);
        showToastMessage("Failed to restore board");
      } finally {
        setProcessing(false);
      }
    }

    if (action === "delete") {
      setShowConfirm(true);
    }
  };

  const handlePermanentDelete = async () => {
    const id = board._id || board.id;
    try {
      setProcessing(true);
      await api.delete(`/board/${id}/permanent`);
      onActionComplete?.(id);
      showToastMessage("Board permanently deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      showToastMessage("Failed to delete board");
    } finally {
      setProcessing(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* 🔥 Confirm Modal */}
      <ConfirmDeleteModal
        show={showConfirm}
        onConfirm={handlePermanentDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {/* 🟡 Card */}
      <motion.div
        whileHover={{ y: -6, scale: 1.05, rotateY: 4 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative group w-80 h-56 cursor-pointer select-none rounded-3xl overflow-hidden
                   bg-gradient-to-br from-[#0b1914]/90 via-[#143121]/85 to-[#1a3e28]/85
                   border border-lime-400/20 backdrop-blur-2xl
                   shadow-[0_0_35px_rgba(255,255,150,0.08)]
                   hover:shadow-[0_0_50px_rgba(255,255,150,0.25)]
                   transition-all duration-700"
      >
        {/* ✨ Animated border & holo beam */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-3xl border border-yellow-300/20 pointer-events-none"
        />
        <motion.div
          animate={{ x: ["-150%", "150%"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-tr from-transparent via-yellow-200/10 to-transparent opacity-50 blur-lg"
        />

        {/* 💫 Card Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6">
          <div className="flex justify-between items-start">
            <motion.h3
              className="text-2xl font-extrabold text-transparent bg-clip-text 
                         bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-200
                         drop-shadow-[0_0_12px_rgba(255,255,150,0.35)]"
              whileHover={{ scale: 1.08 }}
            >
              {board.title}
            </motion.h3>

            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-1.5 rounded-full hover:bg-yellow-400/20 transition-all duration-300"
            >
              <MoreVertical className="w-5 h-5 text-yellow-300" />
            </button>
          </div>

          <p className="text-sm text-lime-100/80 mt-2 line-clamp-2 leading-snug">
            {board.description || "No description provided."}
          </p>

          <div className="text-xs text-yellow-200/70 mt-4">
            🗓 Archived on{" "}
            <span className="text-yellow-300 font-medium">
              {new Date(board.archivedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 🌟 Bottom Glow */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-10 bg-yellow-300/20 blur-3xl rounded-full"
          whileHover={{ opacity: 1, scale: 1.2 }}
        />

        {/* ⚙ Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <DropdownPortal rect={btnRect}>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="w-44 rounded-xl bg-[#0d1c15]/90 border border-lime-400/20 shadow-xl backdrop-blur-xl overflow-hidden"
              >
                <button
                  disabled={processing}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("restore");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-lime-200 hover:bg-lime-500/10 transition"
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
    </>
  );
};

export default ArchiveBoardCard;
