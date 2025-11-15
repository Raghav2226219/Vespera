import { motion } from "framer-motion";

const InviteLoader = ({ message = "Validating your invite link..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden
                    bg-gradient-to-br from-[#030a08] via-[#071812] to-[#0f2a22]
                    text-white z-[9999]">
      
      {/* 🌕 Ambient Glow Background */}
      <motion.div
        className="absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full bg-yellow-300/10 blur-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-12rem] right-[-12rem] w-[30rem] h-[30rem] rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ⚙️ Loader Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* 🌀 Outer Energy Ring */}
        <motion.div
          className="absolute w-40 h-40 rounded-full border-[3px] border-transparent"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,255,150,0.8), rgba(52,211,153,0.6), rgba(255,255,150,0.8))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />

        {/* 🔄 Inner Reverse Rotation */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-[3px] border-transparent"
          style={{
            background:
              "conic-gradient(from 180deg, rgba(132,255,200,0.8), rgba(255,255,100,0.5), rgba(132,255,200,0.8))",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />

        {/* ⚡ Central Energy Core */}
        <motion.div
          className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-tr 
                     from-yellow-300 via-lime-300 to-emerald-300 
                     shadow-[0_0_25px_rgba(255,255,150,0.6)]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
            filter: [
              "brightness(1) blur(0px)",
              "brightness(1.4) blur(2px)",
              "brightness(1) blur(0px)",
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 🌫 Core Reflection Glow */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-gradient-to-t from-yellow-300/10 via-lime-300/5 to-transparent blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 🌐 Scanning Light Arc */}
        <motion.div
          className="absolute w-[120px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />

        {/* 🧠 Verification Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.4, 1, 0.7, 1], y: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-36 text-lg font-semibold tracking-[0.1em]
                     bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                     bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,150,0.3)]"
        >
          {message}
        </motion.p>

        {/* ✨ Underline pulse */}
        <motion.div
          className="mt-3 w-28 h-[2px] rounded-full bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default InviteLoader;
