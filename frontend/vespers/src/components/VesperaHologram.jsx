import { motion } from "framer-motion";

export default function VesperaHologram() {
  return (
    <div className="relative w-full flex flex-col items-center justify-end py-24 overflow-visible">
      {/* ---- Hologram Beam (Emerald-Lime Projection Cone) ---- */}
      <motion.div
        className="absolute bottom-12 w-[220px] h-[340px] rounded-t-full 
                   bg-gradient-to-t from-lime-400/20 via-yellow-200/10 to-transparent 
                   blur-3xl"
        animate={{
          opacity: [0.45, 0.85, 0.45],
          scaleY: [1, 1.1, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ---- Rotating Energy Ring around base ---- */}
      <motion.div
        className="absolute bottom-[4.3rem] w-[90px] h-[90px] rounded-full border-[2px]
                   border-gradient-to-r from-lime-300 via-yellow-300 to-lime-400
                   shadow-[0_0_30px_rgba(255,255,150,0.3)] blur-[0.5px]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(190,255,150,0.25), rgba(255,255,150,0.2), rgba(190,255,150,0.25))",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* ---- Hologram Base Projector ---- */}
      <motion.div
        className="absolute bottom-8 w-14 h-14 rounded-full bg-gradient-to-t from-lime-400/40 via-yellow-300/30 to-emerald-300/30
                   shadow-[0_0_40px_rgba(255,255,150,0.4)] blur-[1px]"
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ---- Floating Energy Dust Particles (Emerald + Lime + Yellow) ---- */}
      {[...Array(16)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-10 h-[3px] w-[3px] rounded-full blur-[1px]"
          style={{
            left: `${50 + Math.sin(i * 22.5) * 70}px`,
            backgroundColor:
              i % 3 === 0
                ? "rgba(190,255,150,0.8)"
                : i % 2 === 0
                ? "rgba(255,255,150,0.8)"
                : "rgba(120,255,190,0.8)",
          }}
          animate={{
            y: [0, -220],
            opacity: [0, 0.8, 0],
            scale: [0.6, 1, 0.4],
          }}
          transition={{
            delay: i * 0.2,
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ---- Holographic “V” Logo ---- */}
      <div className="relative">
        {/* --- Scanning highlight pass --- */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent blur-md"
          animate={{
            x: ["-100%", "120%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.5,
          }}
        />

        {/* --- Glitch flicker & main logo --- */}
        <motion.div
          className="relative text-[7rem] font-extrabold bg-gradient-to-t from-lime-400 via-yellow-300 to-emerald-200
                     bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,150,0.55)] select-none"
          animate={{
            opacity: [0.2, 0.8, 0.4, 1, 0.9, 1],
            filter: [
              "contrast(1.1) brightness(0.7)",
              "contrast(1.3) brightness(1.1)",
              "contrast(1.1) brightness(0.9)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          V
        </motion.div>

        {/* --- Glitch Lines --- */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-lime-300/70 to-transparent"
            animate={{
              y: [`${40 + i * 20}%`, `${20 + i * 15}%`, `${50 + i * 10}%`],
              opacity: [0.1, 0.7, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* ---- Subtitle ---- */}
      <motion.p
        className="mt-4 text-xs uppercase tracking-[0.3em] text-lime-300/80"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Vespera Venture Division
      </motion.p>
    </div>
  );
}
