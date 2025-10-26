import React from "react";
import { MoreVertical } from "lucide-react";

const TaskCard = ({ task, onMenuClick }) => {
  return (
    <div
      className="
        relative
        group
        bg-white/10 
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-4
        shadow-lg
        hover:shadow-emerald-500/20
        hover:bg-white/15
        transition-all
        duration-300
        cursor-pointer
      "
    >
      {/* Task Title */}
      <h3 className="text-lg font-semibold text-emerald-300 tracking-wide">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-emerald-100/70 mt-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Assigned User */}
      {task.assignedUser && (
        <div className="mt-3 flex items-center text-xs text-emerald-200/80">
          <span className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] font-bold mr-2">
            {task.assignedUser.name.charAt(0).toUpperCase()}
          </span>
          <span>{task.assignedUser.name}</span>
        </div>
      )}

      {/* Options Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.(task);
        }}
        className="
          absolute top-3 right-3 
          text-emerald-200/70 
          hover:text-emerald-300 
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default TaskCard;
