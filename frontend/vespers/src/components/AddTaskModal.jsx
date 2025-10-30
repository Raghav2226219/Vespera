import React from "react";

const AddTaskModal = ({ board, onAddTaskClick }) => {
  return (
    <div className="relative z-10 backdrop-blur-lg bg-white/5 px-6 py-5 md:px-8 md:py-6 rounded-2xl border border-white/10 shadow-xl mb-10 flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
          {board?.title || "Untitled Board"}
        </h1>
        <p className="text-emerald-200/80 mt-2 text-sm md:text-base max-w-2xl">
          {board?.description || "No description provided."}
        </p>
      </div>

      <button
        onClick={onAddTaskClick}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-xl shadow-lg font-semibold transition-all duration-200 hover:scale-105"
      >
        + Add Task
      </button>
    </div>
  );
};

export default AddTaskModal;
