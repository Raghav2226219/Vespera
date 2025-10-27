import React from "react";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

const Column = ({ column, boardId, onTaskDelete }) => {
  // ✅ NO local state - use parent's state directly
  // This prevents sync issues and flicker

  // ✅ Delete handler that calls parent's onTaskDelete
  const handleDeleteTask = (taskId) => {
    console.log('Column: Deleting task', taskId, 'from column', column.id);
    if (onTaskDelete) {
      onTaskDelete(taskId, column.id);
    } else {
      console.error('onTaskDelete prop is not provided');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-emerald-400/20 p-4 rounded-2xl shadow-lg min-w-[320px] max-w-[360px] transition-all duration-300 hover:shadow-emerald-400/20 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-emerald-300">
          {column.name}
        </h2>
        <span className="text-xs text-emerald-200/60 bg-emerald-500/20 px-2 py-1 rounded-full">
          {column.tasks?.length || 0}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar rounded-xl transition-colors ${
              snapshot.isDraggingOver ? "bg-emerald-500/10" : ""
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
                  />
                ))
            ) : (
              <p className="text-sm text-emerald-200/60 italic">
                No tasks yet...
              </p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;