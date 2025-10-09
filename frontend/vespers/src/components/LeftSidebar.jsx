import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, PlusCircle, Upload, X, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

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

            {/* Menu Buttons */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 custom-scroll">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 transition-all duration-300 w-full text-white/90"
              >
                <PlusCircle className="w-5 h-5 text-emerald-300" /> New Board
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 transition-all duration-300 w-full text-white/90"
              >
                <Upload className="w-5 h-5 text-emerald-300" /> Import Tasks
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/boards")}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 transition-all duration-300 w-full text-white/90"
              >
                <ClipboardList className="w-5 h-5 text-emerald-300" /> View Boards
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
