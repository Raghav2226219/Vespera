import { motion } from "framer-motion";

export default function VesperaMiniHolo({ size = 120 }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* 🌀 Dimensional Portal Halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background:
            "conic-gradient(from 0deg, rgba(255,255,180,0.25), rgba(200,255,150,0.4), rgba(255,255,100,0.25))",
          maskImage:
            "radial-gradient(circle, transparent 35%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 35%, black 100%)",
          filter: "blur(8px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* 🌕 Pulsing Core */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background:
            "radial-gradient(circle, rgba(255,255,200,0.7), rgba(255,255,120,0.3), rgba(190,255,150,0.1))",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ⚡ Central Runic Symbol */}
      <motion.div
        className="absolute font-extrabold text-transparent bg-clip-text"
        style={{
          fontSize: size * 0.7,
          backgroundImage:
            "linear-gradient(135deg, #fffaa3 0%, #d4ff8c 30%, #b3ffec 80%)",
          textShadow:
            "0 0 12px rgba(255,255,160,0.6), 0 0 28px rgba(190,255,150,0.3)",
          letterSpacing: "-3px",
        }}
        animate={{
          opacity: [0.9, 1, 0.9],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        V
      </motion.div>

      {/* ✨ Data Filaments (Orbiting Particles) */}
      {[...Array(9)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            background:
              "radial-gradient(circle, rgba(255,255,180,0.8), rgba(255,255,150,0.4))",
            top: "50%",
            left: "50%",
            marginTop: -size * 0.025,
            marginLeft: -size * 0.025,
            transformOrigin: `${size / 2.1}px center`,
            filter: "blur(0.5px)",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4 + i * 0.6,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* 🌫️ Shimmering Energy Field */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.1,
          height: size * 1.1,
          background:
            "radial-gradient(circle, rgba(255,255,150,0.12), rgba(255,255,100,0.05), transparent 80%)",
          filter: "blur(4px)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 💥 Pulse Wave */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          border: "1px solid rgba(255,255,180,0.3)",
          boxShadow:
            "0 0 20px rgba(255,255,150,0.25), inset 0 0 10px rgba(255,255,180,0.15)",
        }}
        animate={{
          scale: [1, 2.4],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
      />
    </div>
  );
}
