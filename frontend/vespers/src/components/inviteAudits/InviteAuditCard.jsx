import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  UserPlus,
  UserCheck,
  UserX,
  AlertTriangle,
  MoreVertical,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Toast from "../Toast";

const InviteAuditCard = ({ log, idx, onCancelSuccess }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const menuRef = useRef(null);

  const getActionIcon = (a) => {
    switch (a) {
      case "SENT":
        return <UserPlus className="text-lime-400 w-5 h-5" />;
      case "ACCEPTED":
        return <UserCheck className="text-yellow-300 w-5 h-5" />;
      case "CANCELLED":
        return <UserX className="text-red-400 w-5 h-5" />;
      case "SUSPICIOUS":
        return <AlertTriangle className="text-orange-400 w-5 h-5" />;
      default:
        return <Clock className="text-emerald-300 w-5 h-5" />;
    }
  };

  const colorFor = (a) => {
    switch (a) {
      case "SENT":
        return "from-lime-800/40 to-yellow-800/40";
      case "ACCEPTED":
        return "from-yellow-700/40 to-lime-600/40";
      case "CANCELLED":
        return "from-red-700/40 to-orange-600/40";
      case "SUSPICIOUS":
        return "from-yellow-700/40 to-orange-700/40";
      default:
        return "from-gray-700/40 to-gray-800/40";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancelInvite = async () => {
    try {
      setLoading(true);

      const inviteId = log.inviteId || log.invite?.id;

      if (!inviteId || isNaN(inviteId)) {
        alert("Invite ID missing — cannot cancel this invite ❌");
        console.error("Missing inviteId in log:", log);
        return;
      }

      const res = await api.delete(`/invites/${inviteId}/cancel`);

      if (res.data.success) {
        // ✅ show success toast
        setToastMessage("Invite cancelled successfully");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);

        // ✅ fade out + refresh parent
        setVisible(false);
        setTimeout(() => {
          onCancelSuccess?.(inviteId);
        }, 300);
      } else {
        alert(res.data.message || "Failed to cancel invite");
      }
    } catch (err) {
      console.error("Error cancelling invite:", err);
      alert("Server error while cancelling invite");
    } finally {
      setLoading(false);
      setMenuOpen(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* ✅ Confirmation Modal */}
      <ConfirmDeleteModal
        show={showConfirm}
        onConfirm={handleCancelInvite}
        onCancel={() => setShowConfirm(false)}
      />

      {/* ✅ Success Toast */}
      <Toast show={showToast} message={toastMessage} />

      <AnimatePresence mode="sync">
        {visible && (
          <motion.div
            key={log.id || idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: -10,
              transition: { duration: 0.25 },
            }}
            transition={{ duration: 0.25, delay: idx * 0.02 }}
            className={`relative overflow-hidden bg-gradient-to-br ${colorFor(
              log.action
            )} p-5 rounded-2xl border border-yellow-400/20 
                 shadow-[0_0_25px_rgba(255,255,150,0.15)] 
                 hover:shadow-[0_0_35px_rgba(255,255,150,0.3)] 
                 backdrop-blur-xl transition-all duration-300`}
          >
            {/* Glow orb */}
            <div className="absolute -left-3 top-6 w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(255,255,150,0.6)]" />

            {/* Top section */}
            <div className="flex items-center gap-3 mb-2">
              {getActionIcon(log.action)}
              <h3 className="text-lg font-semibold capitalize bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-lime-200 to-emerald-300">
                {log.action.toLowerCase()}
              </h3>
              <span className="ml-auto text-xs text-yellow-200/70">
                {new Date(log.createdAt).toLocaleString()}
              </span>

              {/* ⋮ Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="p-1.5 rounded-full hover:bg-yellow-400/10 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-yellow-300" />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-gradient-to-br from-[#0b1914]/90 via-[#153022]/85 to-[#1a3e28]/85
                           border border-yellow-400/20 rounded-xl backdrop-blur-2xl 
                           shadow-[0_8px_25px_rgba(255,255,150,0.15)] overflow-hidden z-50"
                    >
                      <button
                        onClick={() => setShowConfirm(true)} // ✅ open modal
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 transition disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <UserX className="w-4 h-4 text-red-400" />
                        )}
                        {loading ? "Cancelling..." : "Cancel Invite"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Info section */}
            <div className="text-sm text-yellow-100/90 space-y-1 pl-1">
              <p>
                <span className="text-yellow-300 font-medium">Board:</span>{" "}
                {log.board?.title}{" "}
                <span className="text-yellow-200/60">(# {log.board?.id})</span>
              </p>
              <p>
                <span className="text-lime-300 font-medium">Inviter:</span>{" "}
                {log.inviter?.name} ({log.inviter?.email})
              </p>
              <p>
                <span className="text-yellow-200 font-medium">Invitee:</span>{" "}
                {log.inviteeEmail || (
                  <span className="text-yellow-200/60 italic">Unknown</span>
                )}
              </p>
              {log.acceptedBy ? (
                <p>
                  <span className="text-lime-300 font-medium">Accepted By:</span>{" "}
                  {log.acceptedBy.name} ({log.acceptedBy.email})
                </p>
              ) : (
                <p className="text-yellow-200/70 italic">Awaiting acceptance…</p>
              )}
            </div>

            {/* Holo beam shimmer */}
            <motion.div
              className="absolute top-0 left-[-40%] w-[60%] h-full bg-gradient-to-tr from-transparent via-yellow-200/10 to-transparent opacity-50"
              animate={{ x: ["-40%", "120%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InviteAuditCard;
