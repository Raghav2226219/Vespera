import React from "react";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

const Column = ({ column, boardId, onTaskDelete, onTaskUpdate }) => {
  const handleDeleteTask = (taskId) => {
    console.log("Column: Deleting task", taskId, "from column", column.id);
    if (onTaskDelete) onTaskDelete(taskId, column.id);
  };

  const handleUpdateTask = (updatedTask) => {
    if (onTaskUpdate) onTaskUpdate(updatedTask, column.id);
  };

  return (
    <div
      className="relative flex flex-col min-w-[320px] max-w-[360px] p-4 rounded-2xl
                 border border-lime-400/20 backdrop-blur-xl 
                 bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-lime-950/50
                 shadow-[0_0_25px_rgba(255,255,150,0.08)]
                 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,150,0.2)]
                 hover:scale-[1.01] overflow-hidden"
    >
      {/* ✨ Animated soft glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-lime-400/5 to-transparent blur-2xl pointer-events-none"></div>

      {/* 🟢 Header */}
      <div className="relative z-10 flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 via-yellow-200 to-emerald-300 drop-shadow-[0_0_8px_rgba(255,255,150,0.3)]">
          {column.name}
        </h2>
        <span className="text-xs font-semibold text-lime-100/80 bg-gradient-to-r from-lime-600/30 to-yellow-600/30 px-2 py-1 rounded-full border border-lime-400/20">
          {column.tasks?.length || 0}
        </span>
      </div>

      {/* 🌀 Droppable area */}
      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`relative flex flex-col gap-3 overflow-y-auto pr-2 rounded-xl transition-all duration-300 custom-scrollbar
              ${
                snapshot.isDraggingOver
                  ? "bg-gradient-to-br from-lime-500/20 via-yellow-400/20 to-transparent shadow-[0_0_20px_rgba(255,255,150,0.2)]"
                  : "bg-white/5"
              }`}
            style={{ height: "60vh" }}
          >
            {column.tasks && column.tasks.length > 0 ? (
              column.tasks
                .sort((a, b) => a.position - b.position)
                .map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onDelete={(taskId) => handleDeleteTask(taskId)}
                    onUpdate={(updatedTask) => handleUpdateTask(updatedTask)}
                  />
                ))
            ) : (
              <p className="text-sm text-lime-200/70 italic text-center py-4">
                No tasks yet...
              </p>
            )}
            {provided.placeholder}

            {/* ⚡ Subtle holo beam animation */}
            {snapshot.isDraggingOver && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent animate-pulse"></div>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* ✨ Glow shimmer bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent opacity-70 animate-pulse"></div>
    </div>
  );
};

export default Column;
