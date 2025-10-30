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
        bg-white/10 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-4
        shadow-lg transition-all duration-300 cursor-pointer
        ${
          snapshot.isDragging
            ? "scale-105 shadow-emerald-500/50 bg-white/20 z-[9999]"
            : "hover:shadow-emerald-500/20 hover:bg-white/15"
        }
      `}
      style={{
        ...provided.draggableProps.style,
        zIndex: snapshot.isDragging ? 9999 : "auto",
      }}
    >
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

  // ✏️ Handle Task Update
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

  // Close menu on outside click
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

  const handleUpdateTask = (updatedTask, columnId) => {
  setColumns((prev) =>
    prev.map((col) =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === updatedTask.id ? updatedTask : t
            ),
          }
        : col
    )
  );
};


  const draggableId = (task.id ?? task._id ?? `temp-${index}`).toString();

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
          <PortalAwareItem provided={provided} snapshot={snapshot}>
            <h3 className="text-lg font-semibold text-emerald-300 tracking-wide">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-emerald-100/70 mt-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Three-dot menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={handleMenuToggle}
                className="text-emerald-200/70 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                  className="fixed z-[9999] w-40 bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-1"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <button
                    onClick={() => {
                      setEditModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors rounded-lg"
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
            <div className="bg-gray-900/90 border border-white/10 rounded-2xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-300 mb-4">
                Edit Task
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task Title"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/80 text-white border border-white/10 focus:border-emerald-400 outline-none"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task Description"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/80 text-white border border-white/10 focus:border-emerald-400 outline-none resize-none"
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
                    className="px-3 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
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
