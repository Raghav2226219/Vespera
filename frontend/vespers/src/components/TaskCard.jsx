import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";

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

  return snapshot.isDragging
    ? createPortal(child, document.body)
    : child;
};

const TaskCard = ({ task, index, onMenuClick }) => {
  // Fallback-safe draggableId
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick?.(task);
            }}
            className="absolute top-3 right-3 text-emerald-200/70 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <MoreVertical size={18} />
          </button>
        </PortalAwareItem>
      )}
    </Draggable>
  );
};

export default TaskCard;
