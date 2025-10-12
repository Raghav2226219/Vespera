import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Clock } from "lucide-react";

const NotificationPanel = ({ open, onClose, notifications = [] }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-80 md:w-96 h-full bg-white/10 backdrop-blur-xl border-l border-white/10 shadow-[0_0_25px_rgba(16,185,129,0.2)] p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-300" />
                Notifications
              </h2>
              <button
                onClick={onClose}
                className="text-emerald-200/70 hover:text-emerald-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scroll">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-white/90">{n.message}</p>
                      <Clock className="w-4 h-4 text-emerald-400/70" />
                    </div>
                    <p className="text-xs text-emerald-300/70 mt-2">
                      {n.time || "Just now"}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-emerald-200/70 mt-10">
                  <Bell className="w-10 h-10 mb-3 opacity-50" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
