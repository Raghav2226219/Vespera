import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import api from "../../api/axios";

const InviteValidationPopup = ({ token, onClose }) => {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await api.get(`/invites/validate?token=${token}`);
        setData(res.data);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md p-6 rounded-2xl border border-lime-400/20 bg-gradient-to-b from-[#0f231d] via-[#152e27] to-[#183728] shadow-[0_0_35px_rgba(255,255,150,0.3)] text-lime-100"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
              Invite Validation
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-yellow-300/80 hover:text-yellow-100 transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-yellow-200/80">
              <Loader2 className="animate-spin w-6 h-6" />
              <p>Checking invite validity...</p>
            </div>
          )}

          {status === "success" && data && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-lime-400 w-5 h-5" />
                <span className="font-medium text-lime-200">Valid Invite</span>
              </div>
              <p>
                <span className="text-yellow-200/70">Board:</span>{" "}
                <span className="font-medium text-lime-300">
                  {data.boardTitle}
                </span>
              </p>
              <p>
                <span className="text-yellow-200/70">Invitee:</span>{" "}
                {data.email}
              </p>
              <p>
                <span className="text-yellow-200/70">Role:</span> {data.role}
              </p>
              <p>
                <span className="text-yellow-200/70">Expires:</span>{" "}
                {new Date(data.expiresAt).toLocaleString()}
              </p>
              {data.cancelled && (
                <p className="text-orange-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  This invite has been cancelled.
                </p>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-8 text-red-300">
              <XCircle className="w-6 h-6" />
              <p>Invalid or expired invite.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteValidationPopup;
