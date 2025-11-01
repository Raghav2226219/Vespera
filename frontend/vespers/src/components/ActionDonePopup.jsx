import { motion, AnimatePresence } from "framer-motion";

const ActionDonePopup = ({ message = "Action completed!", show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 rounded-2xl shadow-xl px-12 py-10 border border-emerald-800/40"
          >
            {/* Glow / aura */}
            <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-2xl animate-pulse"></div>

            {/* Animated check mark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-emerald-400/30 border-t-emerald-400 text-emerald-400"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-10 h-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>

            {/* Success message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-emerald-300 font-semibold tracking-wide text-lg"
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionDonePopup;
