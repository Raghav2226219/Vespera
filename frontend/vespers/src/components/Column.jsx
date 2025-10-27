import React, { useState } from "react";
import api from "../api/axios";
import TaskCard from "./TaskCard";
import Loader from "./Loader";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Column = ({ column, boardId, refreshColumns }) => {
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      await api.post(`/tasks/${boardId}/${column.id}`, {
        title: newTask,
        description: "",
      });
      setNewTask("");
      await refreshColumns();
    } catch (err) {
      console.error("Error adding task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-emerald-400/20 p-4 rounded-2xl shadow-lg min-w-[320px] max-w-[360px] transition-all duration-300 hover:shadow-emerald-400/20 flex flex-col">
      {loading && <Loader />}

      {/* ✅ Column Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-emerald-300">
          {column.name}
        </h2>

        {/* ➕ Quick add task */}
        {/* <form onSubmit={handleAddTask} className="flex gap-2 items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="+ Add"
            className="bg-transparent border-b border-emerald-400/40 text-emerald-100 placeholder-emerald-200/50 text-sm w-24 focus:outline-none focus:border-emerald-300"
          />
        </form> */}
      </div>

      {/* 🧲 Droppable area for drag-and-drop */}
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
            {column.tasks.length > 0 ? (
              column.tasks
                // ✅ Keep order consistent (backend sorts by position)
                .sort((a, b) => a.position - b.position)
                .map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-transform ${
                          snapshot.isDragging ? "scale-[1.03]" : ""
                        }`}
                      >
                        <TaskCard task={task} />
                      </div>
                    )}
                  </Draggable>
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
