import React, { useState } from "react";
import api from "../api/axios";
import TaskCard from "./TaskCard";
import Loader from "./Loader";

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

      <h2 className="text-lg font-semibold text-emerald-300 mb-4">
        {column.name}
      </h2>

      {/* ✅ Scrollable Tasks Container */}
      <div
        className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar"
        style={{ height: "60vh" }}
      >
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-sm text-emerald-200/60 italic">No tasks yet...</p>
        )}
      </div>
    </div>
  );
};

export default Column;
