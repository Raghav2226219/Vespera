import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center 
                    bg-gradient-to-br from-[#030a08] via-[#071712] to-[#0e241d] 
                    text-white overflow-hidden z-[9999]">
      {/* 🔮 Background ambient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full 
                   bg-yellow-300/10 blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] 
                   rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🪩 Loader core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* 🌐 Outer rotating holo ring */}
        <motion.div
          className="absolute w-28 h-28 rounded-full border-4 
                     border-yellow-300/40 border-t-transparent border-l-emerald-400/40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        />

        {/* 🌀 Inner rotating ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-[3px] 
                     border-emerald-400/40 border-b-yellow-300/50"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        />

        {/* ⚡ Core energy pulse */}
        <motion.div
          className="relative z-10 w-6 h-6 rounded-full 
                     bg-gradient-to-tr from-yellow-300 via-lime-300 to-emerald-300 
                     shadow-[0_0_25px_rgba(255,255,150,0.6)]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.7, 1],
            filter: [
              "blur(0px) brightness(1)",
              "blur(2px) brightness(1.4)",
              "blur(0px) brightness(1)",
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ✨ Energy aura */}
        <motion.div
          className="absolute w-36 h-36 rounded-full bg-gradient-to-t 
                     from-yellow-400/10 via-lime-300/5 to-transparent blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 🧠 Text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0.5, 1, 0.7, 1], y: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-28 text-xl font-bold tracking-[0.15em] uppercase 
                     bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                     bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,150,0.4)]"
        >
          Initializing Vespera Core...
        </motion.p>

        {/* 🩵 Bottom pulse line */}
        <motion.div
          className="mt-4 w-36 h-[2px] bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;
