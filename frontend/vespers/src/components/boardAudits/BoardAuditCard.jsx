import React from "react";
import { motion } from "framer-motion";
import { User, Clock, Layout, FileText, Trash2, Archive, Edit, Plus, RotateCcw } from "lucide-react";

const BoardAuditCard = ({ log, idx }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "created": return <Plus className="text-lime-400 w-5 h-5" />;
      case "updated": return <Edit className="text-yellow-300 w-5 h-5" />;
      case "archived": return <Archive className="text-orange-400 w-5 h-5" />;
      case "unarchived": return <RotateCcw className="text-emerald-400 w-5 h-5" />;
      case "moved_to_trash": return <Trash2 className="text-red-400 w-5 h-5" />;
      case "restored_from_trash": return <RotateCcw className="text-emerald-400 w-5 h-5" />;
      case "permanently_deleted": return <Trash2 className="text-red-600 w-5 h-5" />;
      default: return <FileText className="text-emerald-300 w-5 h-5" />;
    }
  };

  const colorFor = (action) => {
    switch (action) {
      case "created": return "from-lime-800/40 to-emerald-800/40";
      case "updated": return "from-yellow-700/40 to-lime-600/40";
      case "archived": return "from-orange-800/40 to-yellow-800/40";
      case "moved_to_trash": return "from-red-800/40 to-orange-800/40";
      case "permanently_deleted": return "from-red-900/40 to-red-800/40";
      default: return "from-gray-700/40 to-gray-800/40";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.02 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colorFor(log.action)} p-5 rounded-2xl border border-yellow-400/20 
                 shadow-[0_0_25px_rgba(255,255,150,0.15)] 
                 hover:shadow-[0_0_35px_rgba(255,255,150,0.3)] 
                 backdrop-blur-xl transition-all duration-300 group`}
    >
      {/* Glow orb */}
      <div className="absolute -left-3 top-6 w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(255,255,150,0.6)]" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
        
        {/* 👤 Actor Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-600/20 to-yellow-600/20 border border-yellow-400/20 flex items-center justify-center text-yellow-200 shadow-[0_0_10px_rgba(255,255,150,0.1)]">
            <User size={18} />
          </div>
        </div>

        {/* 📄 Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {getActionIcon(log.action)}
            <h3 className="text-lg font-semibold capitalize bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-lime-200 to-emerald-300">
                {log.action.replace(/_/g, " ")}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-yellow-100/90">
            <span className="font-medium text-lime-300">
              {log.actor?.name || "Unknown User"}
            </span>
            <span className="text-yellow-200/40">•</span>
            <span className="text-yellow-200/60">{log.actor?.email}</span>
            <span className="text-yellow-200/40">in</span>
            <div className="flex items-center gap-1 text-yellow-300">
              <Layout size={12} />
              <span>{log.board?.title || "Unknown Board"}</span>
            </div>
          </div>

          {/* Details */}
          {log.details && (
             <div className="mt-2 text-xs text-yellow-200/70 bg-black/20 p-2 rounded border border-yellow-500/10 font-mono">
                {log.details.message || JSON.stringify(log.details)}
             </div>
          )}
        </div>

        {/* 🕒 Time */}
        <div className="flex items-center gap-1.5 text-xs text-yellow-200/50 whitespace-nowrap md:self-start md:mt-1">
          <Clock size={12} />
          {formatDate(log.createdAt)}
        </div>
      </div>

      {/* Holo beam shimmer */}
      <motion.div
        className="absolute top-0 left-[-40%] w-[60%] h-full bg-gradient-to-tr from-transparent via-yellow-200/10 to-transparent opacity-50"
        animate={{ x: ["-40%", "120%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default BoardAuditCard;
