import { motion } from "framer-motion";

const InviteLoader = ({ message = "Validating your invite..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Emerald soft glow background */}
        <div className="absolute inset-0 blur-3xl bg-emerald-400/10 rounded-full animate-pulse"></div>

        {/* Circular validation spinner (smooth gradient ring) */}
        <motion.div
          className="relative w-20 h-20 rounded-full border-4 border-transparent"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(16,185,129,0.8), rgba(6,182,212,0.4), rgba(16,185,129,0.8))",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
        >
          <div className="absolute inset-[6px] bg-gray-950/80 rounded-full backdrop-blur-md"></div>
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-emerald-300 font-medium tracking-wide text-lg"
        >
          {message}
        </motion.p>

        {/* Subtle shimmer underline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default InviteLoader;
