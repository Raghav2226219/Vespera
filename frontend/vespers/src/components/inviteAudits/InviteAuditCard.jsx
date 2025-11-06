// src/components/inviteAudits/InviteAuditCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clock, UserPlus, UserCheck, UserX, AlertTriangle } from "lucide-react";

const InviteAuditCard = ({ log, idx }) => {
  const getActionIcon = (a) => {
    switch (a) {
      case "SENT": return <UserPlus className="text-emerald-400 w-5 h-5" />;
      case "ACCEPTED": return <UserCheck className="text-cyan-400 w-5 h-5" />;
      case "CANCELLED": return <UserX className="text-red-400 w-5 h-5" />;
      case "SUSPICIOUS": return <AlertTriangle className="text-yellow-400 w-5 h-5" />;
      default: return <Clock className="text-emerald-300 w-5 h-5" />;
    }
  };

  const colorFor = (a) => {
    switch (a) {
      case "SENT": return "from-emerald-600/40 to-cyan-600/40";
      case "ACCEPTED": return "from-cyan-600/40 to-emerald-500/40";
      case "CANCELLED": return "from-red-600/40 to-orange-500/40";
      case "SUSPICIOUS": return "from-yellow-600/40 to-orange-500/40";
      default: return "from-gray-700/40 to-gray-800/40";
    }
  };

  return (
    <motion.div
      key={log.id || idx}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, delay: idx * 0.02 }}
      className={`relative bg-gradient-to-br ${colorFor(
        log.action
      )} p-5 rounded-2xl border border-emerald-400/20 shadow-lg hover:shadow-emerald-500/20 transition-all`}
    >
      <div className="absolute -left-3 top-6 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
      <div className="flex items-center gap-3 mb-2">
        {getActionIcon(log.action)}
        <h3 className="text-lg font-semibold capitalize">
          {log.action.toLowerCase()}
        </h3>
        <span className="ml-auto text-xs text-emerald-300/70">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="text-sm text-white/90 space-y-1 pl-1">
        <p>
          <span className="text-gray-300 font-medium">Board:</span>{" "}
          {log.board?.title}{" "}
          <span className="text-emerald-200/60">(# {log.board?.id})</span>
        </p>
        <p>
          <span className="text-emerald-300 font-medium">Inviter:</span>{" "}
          {log.inviter?.name} ({log.inviter?.email})
        </p>
        <p>
          <span className="text-cyan-300 font-medium">Invitee:</span>{" "}
          {log.inviteeEmail || (
            <span className="text-emerald-200/70 italic">Unknown</span>
          )}
        </p>
        {log.acceptedBy ? (
          <p>
            <span className="text-cyan-300 font-medium">Accepted By:</span>{" "}
            {log.acceptedBy.name} ({log.acceptedBy.email})
          </p>
        ) : (
          <p className="text-emerald-200/70 italic">Awaiting acceptance…</p>
        )}
      </div>
    </motion.div>
  );
};

export default InviteAuditCard;
