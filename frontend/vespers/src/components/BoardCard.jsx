import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import api from "../api/axios";
import Toast from "./Toast";

// 🌌 Dropdown rendered via portal
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

// 🧊 Edit Modal (refined look)
const EditModal = ({ board, onClose, onUpdate, showToast }) => {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    setLoading(true);
    try {
      const res = await api.put(`/board/${board.id}`, { title, description });
      onUpdate(res.data);
      onClose();
      showToast("Board updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to update board");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative p-8 w-[90%] max-w-md rounded-3xl border border-lime-400/20
                     bg-gradient-to-br from-[#0d1f17]/90 via-[#183828]/80 to-[#224b36]/85
                     shadow-[0_0_35px_rgba(255,255,150,0.2)] text-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-lime-400/10 to-transparent blur-2xl"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 drop-shadow-[0_0_18px_rgba(255,255,150,0.25)] mb-6">
            Edit Board
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <input
              type="text"
              placeholder="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-lime-400/20 
                         text-lime-100 placeholder-lime-200/40 focus:outline-none 
                         focus:ring-2 focus:ring-yellow-400/40 transition duration-300"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-lime-400/20 
                         text-lime-100 placeholder-lime-200/40 focus:outline-none 
                         focus:ring-2 focus:ring-yellow-400/40 resize-none transition duration-300"
            ></textarea>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-700/50 text-gray-200 hover:bg-gray-600/60 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 text-gray-900 font-semibold shadow-[0_0_20px_rgba(255,255,150,0.4)] transition-all duration-300"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const BoardCard = ({ board, onOpen, onTrashed }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [btnRect, setBtnRect] = useState(null);
  const menuButtonRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [boardData, setBoardData] = useState(board);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    const rect = menuButtonRef.current?.getBoundingClientRect();
    setBtnRect(rect || null);
    setMenuOpen((prev) => !prev);
  };

  const handleMenuAction = async (action) => {
    setMenuOpen(false);
    if (action === "edit") return setEditModalOpen(true);
    const endpointMap = { archive: `/board/${board.id}/archive`, trash: `/board/${board.id}/trash` };
    try {
      showToastMessage(action === "archive" ? "Board archived successfully!" : "Board moved to trash!");
      await api.patch(endpointMap[action]);
      onTrashed && onTrashed(board.id);
    } catch (err) {
      console.error(err);
      showToastMessage(`Failed to ${action} board`);
    }
  };

  return (
    <>
      <Toast show={showToast} message={toastMessage} />
      <motion.div
        onClick={() => onOpen(boardData)}
        whileHover={{ y: -6, scale: 1.05, rotateY: 4 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative group w-80 h-56 cursor-pointer select-none rounded-3xl overflow-hidden
                   bg-gradient-to-br from-[#0b1914]/90 via-[#143121]/85 to-[#1a3e28]/85
                   border border-lime-400/20 backdrop-blur-2xl
                   shadow-[0_0_35px_rgba(255,255,150,0.08)]
                   hover:shadow-[0_0_50px_rgba(255,255,150,0.25)]
                   transition-all duration-700"
      >
        {/* ✨ Animated holo beam */}
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-3xl border border-yellow-300/20 pointer-events-none"
        />
        <motion.div
          animate={{ x: ["-150%", "150%"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-tr from-transparent via-yellow-200/10 to-transparent opacity-50 blur-lg"
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <motion.h3
              className="text-2xl font-extrabold text-transparent bg-clip-text 
                         bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-200
                         drop-shadow-[0_0_12px_rgba(255,255,150,0.35)]"
              whileHover={{ scale: 1.08 }}
            >
              {boardData.title}
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
            {boardData.description || "Your next big idea starts here."}
          </p>

          <span className="text-xs text-yellow-200/70 mt-3 italic opacity-0 group-hover:opacity-100 transition duration-500">
            ✦ Tap to open board
          </span>
        </div>

        {/* 🌟 Bottom glow */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-10 bg-yellow-300/20 blur-3xl rounded-full"
          whileHover={{ opacity: 1, scale: 1.2 }}
        />

        {/* Dropdown Menu */}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("archive");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-lime-200 hover:bg-lime-500/10 transition"
                >
                  Archive
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("edit");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-yellow-200 hover:bg-yellow-400/10 transition"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("trash");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
                >
                  Move to Trash
                </button>
              </motion.div>
            </DropdownPortal>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <EditModal
            board={boardData}
            onClose={() => setEditModalOpen(false)}
            onUpdate={(updated) => setBoardData(updated)}
            showToast={showToastMessage}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BoardCard;
