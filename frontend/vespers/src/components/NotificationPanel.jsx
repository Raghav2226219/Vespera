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
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[3px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-80 md:w-96 h-full bg-gradient-to-b from-[#0b1612]/90 via-[#132b23]/80 to-[#18382e]/70 
                       backdrop-blur-2xl border-l border-yellow-300/20 
                       shadow-[0_0_30px_rgba(255,255,120,0.15)] p-6 flex flex-col relative overflow-hidden"
          >
            {/* 🌠 Animated Light Sweep */}
            <motion.div
              className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,180,0.15)_50%,transparent_100%)]"
              animate={{ x: ["-100%", "120%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-300 drop-shadow-[0_0_6px_rgba(255,255,120,0.6)]" />
                Notifications
              </h2>
              <button
                onClick={onClose}
                className="text-yellow-200/70 hover:text-yellow-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Divider Glow Line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent mb-4" />

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scroll relative z-10">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-[#0b1c17]/80 via-[#11271e]/70 to-[#1b3b31]/60 
                               border border-yellow-300/20 hover:border-yellow-300/40
                               shadow-[0_0_10px_rgba(255,255,120,0.08)]
                               hover:shadow-[0_0_20px_rgba(255,255,150,0.25)]
                               hover:bg-gradient-to-br hover:from-[#132b24]/90 hover:to-[#1e4438]/80
                               transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-white/90 leading-snug">
                        {n.message}
                      </p>
                      <Clock className="w-4 h-4 text-yellow-300/70 group-hover:text-yellow-300 transition" />
                    </div>
                    <p className="text-xs text-yellow-200/70 mt-2">
                      {n.time || "Just now"}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-yellow-200/70 mt-10">
                  <Bell className="w-10 h-10 mb-3 opacity-50" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>

            {/* ⚡ Bottom Pulse Glow */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent rounded-t-full blur-[3px]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
