import { motion } from "framer-motion";
import BoardsAddSection from "../components/BoardsAddSection";

export default function ViewBoards() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white py-12 px-6 overflow-x-hidden relative">
      {/* Animated Backgrounds */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Main Boards Section */}
      <BoardsAddSection endpoint="/board/all" />
    </div>
  );
}
