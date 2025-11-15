import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../api/axios";

const PortalAwareItem = ({ provided, snapshot, children }) => {
  const child = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        relative group
        bg-gradient-to-br from-[#0a1812]/80 via-[#11261e]/60 to-[#172e28]/40
        border border-emerald-400/20
        rounded-2xl p-4
        shadow-[0_0_25px_rgba(0,0,0,0.5)]
        backdrop-blur-xl
        transition-all duration-300 cursor-pointer
        ${
          snapshot.isDragging
            ? "scale-105 shadow-[0_0_30px_rgba(255,255,120,0.4)] border-yellow-400/50 bg-[#1a3a26]/90 z-[9999]"
            : "hover:shadow-[0_0_20px_rgba(255,255,150,0.3)] hover:border-yellow-300/30"
        }
      `}
      style={{
        ...provided.draggableProps.style,
        zIndex: snapshot.isDragging ? 9999 : "auto",
      }}
    >
      {/* ✨ Animated border shimmer */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border border-yellow-300/20 blur-[1px]" />
        <div className="absolute inset-0 rounded-2xl border border-emerald-300/20" />
      </div>

      {/* 🌈 Holo line sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,180,0.15)_50%,transparent_100%)] animate-[shine_4s_linear_infinite]" />
      </div>

      {children}
    </div>
  );
  return snapshot.isDragging ? createPortal(child, document.body) : child;
};

const TaskCard = ({ task, index, onDelete, onUpdate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleDelete = async () => {
    try {
      await onDelete?.(task.id);
      setMenuOpen(false);
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/tasks/${task.id}`, { title, description });
      onUpdate?.(res.data);
      setEditModal(false);
      setMenuOpen(false);
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, left: rect.right - 150 });
    setMenuOpen((prev) => !prev);
  };

  const draggableId = (task.id ?? task._id ?? `temp-${index}`).toString();

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
          <PortalAwareItem provided={provided} snapshot={snapshot}>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,150,0.4)]">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-emerald-100/70 mt-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* 🟡 Three-dot menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={handleMenuToggle}
                className="text-yellow-300/70 hover:text-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Dropdown menu */}
            {menuOpen &&
              createPortal(
                <div
                  ref={menuRef}
                  onMouseLeave={() => setMenuOpen(false)}
                  className="fixed z-[9999] w-40 bg-gradient-to-br from-[#0f1d17]/95 to-[#1a3229]/90 border border-yellow-300/20 rounded-xl shadow-[0_0_20px_rgba(255,255,120,0.25)] backdrop-blur-xl overflow-hidden"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <button
                    onClick={() => {
                      setEditModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-lime-300 hover:bg-yellow-200/10 transition-colors rounded-lg"
                  >
                    <Pencil size={14} /> Edit Task
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                  >
                    <Trash2 size={14} /> Delete Task
                  </button>
                </div>,
                document.body
              )}
          </PortalAwareItem>
        )}
      </Draggable>

      {/* ✏️ Edit Modal */}
      {editModal &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-yellow-300/20 rounded-2xl p-6 w-96 shadow-[0_0_40px_rgba(255,255,120,0.3)]">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent mb-4">
                Edit Task
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task Title"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d201a]/80 text-white border border-yellow-300/20 focus:border-yellow-400 outline-none"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task Description"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d201a]/80 text-white border border-yellow-300/20 focus:border-yellow-400 outline-none resize-none"
                  rows="3"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-yellow-300 to-lime-300 text-gray-900 font-semibold hover:shadow-[0_0_20px_rgba(255,255,120,0.4)] transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskCard;
