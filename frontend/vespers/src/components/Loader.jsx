import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Glass background */}
        <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full animate-pulse"></div>

        {/* Rotating cube spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        ></motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-emerald-300 font-semibold tracking-wide text-lg"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;
