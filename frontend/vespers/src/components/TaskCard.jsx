import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreVertical, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../api/axios"; // ✅ so we can call delete endpoint

// Portal-aware draggable wrapper
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

const TaskCard = ({ task, index, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      onDelete?.(); // refresh parent after delete
      setMenuOpen(false);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const draggableId = (task.id ?? task._id ?? `temp-${index}`).toString();

  return (
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
          <div ref={menuRef} className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="text-emerald-200/70 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-1"
              >
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                >
                  <Trash2 size={14} /> Delete Task
                </button>
              </div>
            )}
          </div>
        </PortalAwareItem>
      )}
    </Draggable>
  );
};

export default TaskCard;
