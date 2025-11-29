import React from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ArrowRightCircle, 
  User, 
  Calendar, 
  Flag, 
  CheckCircle2,
  Layout
} from "lucide-react";
import { format } from "date-fns";

const TaskAuditCard = ({ audit, index }) => {
  const { actor, action, details, createdAt, board } = audit;

  // 🎨 Color & Icon Logic
  const getActionStyle = (act) => {
    switch (act) {
      case "created":
        return {
          gradient: "from-lime-500/20 to-emerald-500/20",
          border: "border-lime-500/30",
          icon: <PlusCircle className="w-5 h-5 text-lime-400" />,
          text: "text-lime-300",
        };
      case "updated":
        return {
          gradient: "from-yellow-500/20 to-orange-500/20",
          border: "border-yellow-500/30",
          icon: <Edit3 className="w-5 h-5 text-yellow-400" />,
          text: "text-yellow-300",
        };
      case "moved":
        return {
          gradient: "from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          icon: <ArrowRightCircle className="w-5 h-5 text-blue-400" />,
          text: "text-blue-300",
        };
      case "deleted":
        return {
          gradient: "from-red-500/20 to-pink-500/20",
          border: "border-red-500/30",
          icon: <Trash2 className="w-5 h-5 text-red-400" />,
          text: "text-red-300",
        };
      default:
        return {
          gradient: "from-gray-500/20 to-slate-500/20",
          border: "border-gray-500/30",
          icon: <Layout className="w-5 h-5 text-gray-400" />,
          text: "text-gray-300",
        };
    }
  };

  const style = getActionStyle(action);

  // Helper to format details
  const renderDetails = () => {
    if (!details) return null;
    
    return (
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-yellow-100/70 bg-black/20 p-3 rounded-lg border border-yellow-400/10">
        <div className="flex items-center gap-2">
            <Layout className="w-3 h-3 text-yellow-400/60" />
            <span>Status: <span className="text-yellow-200">{details.status || "N/A"}</span></span>
        </div>
        <div className="flex items-center gap-2">
            <Flag className="w-3 h-3 text-yellow-400/60" />
            <span>Priority: <span className={`font-medium ${
                details.priority === 'HIGH' ? 'text-red-400' : 
                details.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
            }`}>{details.priority || "N/A"}</span></span>
        </div>
        {details.dueDate && (
            <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-yellow-400/60" />
                <span>Due: <span className="text-yellow-200">{format(new Date(details.dueDate), "MMM d, yyyy")}</span></span>
            </div>
        )}
        {details.mentions && details.mentions.length > 0 && (
            <div className="flex items-center gap-2 sm:col-span-2">
                <User className="w-3 h-3 text-yellow-400/60" />
                <span>Mentions: <span className="text-yellow-200">{details.mentions.join(", ")}</span></span>
            </div>
        )}
        {action === 'moved' && details.fromColumnId && (
             <div className="flex items-center gap-2 sm:col-span-2 text-blue-200/80">
                <ArrowRightCircle className="w-3 h-3" />
                <span>Moved to new column</span>
            </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(255, 255, 150, 0.1)" }}
      className={`relative p-5 rounded-2xl border ${style.border} 
                  bg-gradient-to-br ${style.gradient} backdrop-blur-xl 
                  shadow-lg overflow-hidden group`}
    >
      {/* 🌟 Glow Orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all duration-500" />

      {/* ⚡ Holo Beam Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
        
        {/* Left: Icon & Main Info */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-black/20 border ${style.border} shadow-inner`}>
            {style.icon}
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-50 flex items-center gap-2">
              {actor?.name || "Unknown User"}
              <span className={`text-xs px-2 py-0.5 rounded-full border ${style.border} bg-black/20 ${style.text} uppercase tracking-wider`}>
                {action.replace(/_/g, " ")}
              </span>
            </h3>
            
            <p className="text-sm text-yellow-100/60 mt-1">
              {action === "created" && "Created task"}
              {action === "updated" && "Updated task"}
              {action === "moved" && "Moved task"}
              {action === "deleted" && "Deleted task"}
              <span className="text-yellow-200 font-medium ml-1">"{details?.title || "Unknown Task"}"</span>
              <span className="mx-2 text-yellow-500/40">•</span>
              <span className="text-yellow-100/50">{board?.title || "Unknown Board"}</span>
            </p>

            {renderDetails()}
          </div>
        </div>

        {/* Right: Timestamp */}
        <div className="text-right min-w-[120px]">
          <p className="text-xs font-medium text-yellow-200/80">
            {format(new Date(createdAt), "MMM d, yyyy")}
          </p>
          <p className="text-[10px] text-yellow-100/40 uppercase tracking-widest mt-0.5">
            {format(new Date(createdAt), "h:mm a")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskAuditCard;
