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

  // 💡 Base button style
  const baseButtonClasses =
    "flex items-center gap-3 p-3 rounded-xl w-full font-medium text-yellow-100 " +
    "bg-gradient-to-r from-[#0b1c17]/60 via-[#102720]/60 to-[#153129]/60 " +
    "border border-yellow-300/20 hover:border-yellow-300/40 " +
    "hover:from-[#153529]/70 hover:to-[#1a3f34]/70 " +
    "hover:text-yellow-50 shadow-inner shadow-yellow-900/20 " +
    "transition-all duration-300";

  // 🌟 Highlighted button style
  const highlightButtonClasses =
    baseButtonClasses +
    " border-yellow-300/40 shadow-[0_0_15px_rgba(255,255,150,0.25)] " +
    "bg-gradient-to-r from-yellow-300/20 via-lime-300/10 to-emerald-400/20";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-[3px]"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-72 md:w-80 h-full 
                       bg-gradient-to-br from-[#0c1c18]/90 via-[#102721]/85 to-[#14342a]/85 
                       backdrop-blur-2xl border-r border-yellow-300/20 
                       shadow-[0_0_25px_rgba(255,255,150,0.15)] 
                       p-6 flex flex-col overflow-hidden"
          >
            {/* ⚡ Animated yellow energy beam (left edge) */}
            <motion.div
              className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-yellow-300 via-lime-300 to-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-yellow-300" />
                Dashboard Menu
              </h2>
              <button
                onClick={onClose}
                className="text-yellow-200/70 hover:text-yellow-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Buttons */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 custom-scroll">
              {/* Archive */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/archive")}
                className={baseButtonClasses}
              >
                <Archive className="w-5 h-5 text-yellow-300" /> Archive
              </motion.button>

              {/* Board Audits */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/board-audits")}
                className={baseButtonClasses}
              >
                <ClipboardList className="w-5 h-5 text-yellow-300" /> Board Audits
              </motion.button>

              {/* Task Audits */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/task-audits")}
                className={baseButtonClasses}
              >
                <ClipboardList className="w-5 h-5 text-yellow-300" /> Task Audits
              </motion.button>

              {/* Invite Audits */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/invite-audits")}
                className={baseButtonClasses}
              >
                <Users2 className="w-5 h-5 text-yellow-300" /> Invite Audits
              </motion.button>

              {/* Invite Members */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/invite")}
                className={baseButtonClasses}
              >
                <UserPlus className="w-5 h-5 text-yellow-300" /> Invite Members
              </motion.button>

              {/* Trash */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/trash")}
                className={baseButtonClasses}
              >
                <Trash2 className="w-5 h-5 text-yellow-300" /> Trash
              </motion.button>
            </div>

            {/* Footer */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mt-auto text-center text-sm bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent italic"
            >
              “Stay organized. Stay ahead. ⚡”
            </motion.div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeftSidebar;
