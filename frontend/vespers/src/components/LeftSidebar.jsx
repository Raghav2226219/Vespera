import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Trash2,
  Upload,
  X,
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Users2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const baseButtonClasses =
    "flex items-center gap-3 p-3 rounded-xl w-full font-medium text-emerald-100 " +
    "bg-gradient-to-r from-emerald-700/30 to-cyan-700/30 " +
    "border border-emerald-400/20 hover:from-emerald-600/40 hover:to-cyan-600/40 " +
    "hover:text-emerald-50 shadow-inner shadow-emerald-900/30 " +
    "transition-all duration-300";

  const highlightButtonClasses =
    baseButtonClasses +
    " border-emerald-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-start bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 md:w-80 h-full bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-[0_0_25px_rgba(16,185,129,0.2)] p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-emerald-300" />
                Dashboard Menu
              </h2>
              <button
                onClick={onClose}
                className="text-emerald-200/70 hover:text-emerald-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Buttons (Alphabetical Order) */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 custom-scroll">
              {/* Archive */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/archive")}
                className={baseButtonClasses}
              >
                <Archive className="w-5 h-5 text-emerald-300" /> Archive
              </motion.button>

              {/* Board Audits */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/board-audits")}
                className={baseButtonClasses}
              >
                <ClipboardList className="w-5 h-5 text-emerald-300" /> Board Audits
              </motion.button>

              {/* Import Tasks */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                className={baseButtonClasses}
              >
                <Upload className="w-5 h-5 text-emerald-300" /> Import Tasks
              </motion.button>

              {/* Invite Audits */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/invite-audits")}
                className={baseButtonClasses}
              >
                <Users2 className="w-5 h-5 text-emerald-300" /> Invite Audits
              </motion.button>

              {/* Invite Members */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/invite")}
                className={highlightButtonClasses}
              >
                <UserPlus className="w-5 h-5 text-emerald-300" /> Invite Members
              </motion.button>

              {/* Trash */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/trash")}
                className={baseButtonClasses}
              >
                <Trash2 className="w-5 h-5 text-emerald-300" /> Trash
              </motion.button>
            </div>

            {/* Footer */}
            <div className="mt-auto text-center text-sm text-emerald-200/70 italic">
              “Stay organized. Stay ahead. 🚀”
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeftSidebar;
