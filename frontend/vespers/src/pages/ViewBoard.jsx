import { motion } from "framer-motion";
import BoardsAddSection from "../components/BoardsAddSection";

export default function ViewBoards() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center 
                 bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29]
                 text-white px-6 py-12 overflow-hidden relative no-scrollbar"
    >
      {/* 🌌 Animated Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -25, 25, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[26rem] h-[26rem] 
                     bg-yellow-400/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 25, -25, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] w-[28rem] h-[28rem] 
                     bg-lime-400/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] 
                     bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] 
                     bg-gradient-to-r from-transparent via-lime-300/30 to-transparent"
        />
      </div>

      {/* 🧾 Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl mb-10 mt-6 flex flex-col items-center"
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center
                     bg-clip-text text-transparent bg-gradient-to-r 
                     from-yellow-300 via-lime-300 to-emerald-200 
                     drop-shadow-[0_0_25px_rgba(255,255,150,0.25)]"
        >
          Your Boards
        </h1>
        <p className="mt-2 text-yellow-100/70 text-sm md:text-base italic tracking-wide">
          Manage, collaborate, and create effortlessly.
        </p>
      </motion.div>

      {/* 🧩 Main Boards Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-6xl z-10"
      >
        <BoardsAddSection endpoint="/board/all" />
      </motion.div>

      {/* ✨ Bottom Glow Line */}
      <motion.div
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-[2px] 
                   bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
      />
    </div>
  );
}
