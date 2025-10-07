// src/components/LeftSidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, PlusCircle, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-r border-white/10 p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-emerald-300">Menu</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Menu Buttons */}
          <button className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-emerald-500/20 transition-all duration-300 w-full">
            <PlusCircle className="w-5 h-5 text-emerald-300" /> New Board
          </button>

          <button className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-emerald-500/20 transition-all duration-300 w-full">
            <Upload className="w-5 h-5 text-emerald-300" /> Import Tasks
          </button>

          <button
            onClick={() => navigate("/boards")}
            className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-emerald-500/20 transition-all duration-300 w-full"
          >
            <ClipboardList className="w-5 h-5 text-emerald-300" /> View Boards
          </button>

          {/* Footer Line */}
          <div className="absolute bottom-6 left-6 right-6 text-sm opacity-70 italic text-center text-emerald-200/70">
            “Stay organized. Stay ahead.”
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default LeftSidebar;
