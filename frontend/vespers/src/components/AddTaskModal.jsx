import React from "react";
import { Users, Info, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddTaskModal = ({ board, onAddTaskClick, onViewMembers }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => navigate(`/board-details/${board?.id}`);
  const handleDashboard = () => navigate("/dashboard");

  const truncateDescription = (text = "", limit = 15) => {
    const words = text.trim().split(/\s+/);
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };

  return (
    <div
      className="relative z-10 overflow-hidden backdrop-blur-2xl 
                 bg-gradient-to-br from-[#0b1914]/90 via-[#143121]/80 to-[#1a3e28]/85 
                 border border-yellow-400/25 rounded-2xl px-6 py-6 md:px-8 md:py-8 mb-10 
                 shadow-[0_0_35px_rgba(255,255,150,0.1)] 
                 transition-all duration-500"
    >
      {/* 🟡 Contained Glow Layers */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/5 via-lime-400/10 to-transparent blur-2xl animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent opacity-80 animate-pulse" />
      </div>

      {/* 🌟 Header Row */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title + Description */}
        <div>
          <h1
            className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                       drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]"
          >
            {board?.title || "Untitled Board"}
          </h1>
          <p className="text-lime-100/80 mt-1 text-sm md:text-base max-w-2xl leading-relaxed">
            {board?.description
              ? truncateDescription(board.description)
              : "No description provided."}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-3 flex-wrap justify-start md:justify-end">
          {/* 🧭 Dashboard */}
          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium 
                       bg-gradient-to-r from-lime-700/80 via-yellow-500/70 to-emerald-600/80 
                       border border-yellow-400/20 text-gray-900 
                       shadow-[0_0_15px_rgba(255,255,150,0.25)]
                       hover:shadow-[0_0_25px_rgba(255,255,150,0.45)] 
                       transition-all duration-300 hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-900" />
            Dashboard
          </button>

          {/* 👥 View Members */}
          <button
            onClick={onViewMembers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium 
                       bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-300 
                       text-gray-900 border border-lime-300/30 
                       shadow-[0_0_20px_rgba(255,255,150,0.3)]
                       hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,150,0.4)] 
                       transition-all duration-300"
          >
            <Users className="w-5 h-5" />
            Members
          </button>

          {/* 📜 Board Details */}
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium 
                       bg-gradient-to-r from-lime-400 via-yellow-400 to-white 
                       text-gray-900 shadow-[0_0_20px_rgba(255,255,150,0.3)] 
                       hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,150,0.4)] 
                       transition-all duration-300"
          >
            <Info className="w-5 h-5" />
            Details
          </button>

          {/* ➕ Add Task */}
          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold 
                       bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                       text-gray-900 border border-yellow-300/30 
                       shadow-[0_0_25px_rgba(255,255,150,0.35)]
                       hover:scale-105 hover:shadow-[0_0_35px_rgba(255,255,150,0.45)] 
                       transition-all duration-300"
          >
            + Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
