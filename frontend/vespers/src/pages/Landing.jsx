import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const float = {
  animate: { y: [0, -10, 0], rotate: [0, 1, -1, 0] },
  transition: {
    duration: 18,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: "easeOut" },
  },
});

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full flex flex-col text-white bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] overflow-hidden">
      {/* 🌌 Animated Holo Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-400/10 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -50, 50, 0], y: [0, 30, -30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] bg-lime-400/10 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-lime-300/30 to-transparent"
        />
      </div>

      {/* 🔮 Navbar */}
      <nav className="relative z-20 w-full border-b border-yellow-300/20 bg-white/5 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,150,0.1)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <motion.div className="flex items-center gap-3" animate={float.animate} transition={float.transition}>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-300 via-lime-300 to-emerald-300 border border-yellow-300/20 shadow-[0_0_25px_rgba(255,255,150,0.25)]">
              <span className="text-gray-900 font-extrabold text-lg tracking-wide">V</span>
            </div>
            <span className="font-semibold text-white/90 tracking-wide text-lg">Vespera</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm rounded-lg border border-yellow-400/20 bg-white/5 text-white/80 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,150,0.25)] transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm rounded-lg font-semibold text-gray-900 bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 hover:from-yellow-200 hover:to-lime-200 shadow-[0_0_20px_rgba(255,255,150,0.3)] transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* 🌠 Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-8 lg:px-20 py-10 lg:py-0 relative z-10 gap-12">
        {/* LEFT — Text Content */}
        <motion.div
          variants={fadeUp(0.1)}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-6 max-w-xl"
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-white drop-shadow-[0_0_20px_rgba(255,255,150,0.25)]"
          >
            Workflows Reimagined.
          </motion.h1>

          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-white/70 text-lg leading-relaxed"
          >
            Manage boards, collaborate effortlessly, and achieve more — powered by Vespera’s
            next-gen real-time workspace.
          </motion.p>

          <div className="flex flex-wrap gap-4 mt-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 text-gray-900 font-semibold shadow-[0_0_25px_rgba(255,255,150,0.25)] transition-all"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-yellow-300/30 text-yellow-200/90 hover:bg-yellow-300/10 transition-all"
              >
                Create Account
              </Link>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-yellow-200/70">
            {["⚡ Realtime sync", "🔒 Secure", "🧭 Elegant UI"].map((txt, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-lg bg-yellow-400/5 border border-yellow-400/10 backdrop-blur-sm"
              >
                {txt}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Floating Mockup */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="flex-1 flex justify-center items-center"
        >
          <motion.div
            animate={float.animate}
            transition={float.transition}
            className="relative w-[380px] h-[260px] md:w-[480px] md:h-[340px] rounded-2xl border border-yellow-400/20 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-3xl shadow-[0_0_40px_rgba(255,255,150,0.1)] overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-tr from-yellow-300/10 via-lime-300/10 to-transparent blur-2xl"
            />
            <div className="absolute inset-4 rounded-xl border border-yellow-400/20 bg-white/5 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="h-3 w-24 rounded-full bg-white/10" />
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <div className="h-3 w-3 rounded-full bg-lime-400/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 h-20 rounded-lg bg-yellow-400/5 border border-yellow-300/10" />
                <div className="h-20 rounded-lg bg-lime-400/5 border border-yellow-300/10" />
              </div>
              <p className="mt-4 text-white/60 text-sm">Board Preview • Active</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* 🌈 Footer */}
      <footer className="relative z-10 border-t border-yellow-400/20 py-4 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-yellow-200/70">
          <div>© {new Date().getFullYear()} Vespera Ventures</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-yellow-100 transition">Privacy</a>
            <a href="#" className="hover:text-yellow-100 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
