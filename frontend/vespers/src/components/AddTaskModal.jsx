import React from "react";
import { Users, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddTaskModal = ({
  board,
  onAddTaskClick,
  onViewMembers,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/board-details/${board?.id}`);
  };

  return (
    <div className="relative z-10 backdrop-blur-xl bg-gradient-to-r from-gray-950 via-emerald-950 to-emerald-900 px-6 py-5 md:px-8 md:py-6 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-10 flex justify-between items-center flex-wrap gap-4">
      {/* Board Info */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
          {board?.title || "Untitled Board"}
        </h1>
        <p className="text-emerald-200/80 mt-2 text-sm md:text-base max-w-2xl">
          {board?.description || "No description provided."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* View Members */}
        <button
          onClick={onViewMembers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md 
          bg-gradient-to-r from-emerald-600 to-emerald-500
          hover:from-emerald-500 hover:to-emerald-400 
          text-white transition-all duration-300 hover:scale-105"
        >
          <Users className="w-5 h-5" />
          Members
        </button>

        {/* Board Details */}
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md 
          bg-gradient-to-r from-emerald-500 to-cyan-500
          hover:from-emerald-400 hover:to-cyan-400 
          text-white transition-all duration-300 hover:scale-105"
        >
          <Info className="w-5 h-5" />
          Details
        </button>

        {/* Add Task */}
        <button
          onClick={onAddTaskClick}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-lg 
          bg-gradient-to-r from-cyan-400 to-emerald-400
          hover:from-cyan-300 hover:to-emerald-300
          text-gray-900 transition-all duration-300 hover:scale-105"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTaskModal;
