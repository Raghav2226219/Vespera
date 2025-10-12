import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const floatSlow = {
  animate: { y: [0, -10, 0], rotate: [0, 1, -1, 0] },
  transition: {
    duration: 16,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

const featureFade = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: "easeOut" },
  },
});

export default function Landing() {
  return (
    <div className="h-screen w-full relative bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white overflow-hidden flex flex-col">
      {/* === BACKGROUND ANIMATION === */}
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(700px 700px at 15% 10%, rgba(34,197,94,0.06), transparent 15%), radial-gradient(600px 600px at 85% 80%, rgba(6,182,212,0.06), transparent 15%)",
          filter: "blur(40px)",
          opacity: 0.95,
        }}
      />

      {/* === FLOATING ORBS === */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, -40, 0], y: [0, -25, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 -top-20 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -50, 50, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-28 bottom-10 w-[520px] h-[520px] rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* === NAVBAR === */}
      <header className="relative z-20">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-5 flex items-center justify-between backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.15)] rounded-b-2xl">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-tr from-emerald-400 to-cyan-300 border border-white/10 shadow-inner shadow-cyan-300/30"
              animate={floatSlow.animate}
              transition={floatSlow.transition}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
            <span className="text-white/90 font-semibold tracking-wide text-lg">
              Vespera
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-sm text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 rounded-md font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* === HERO SECTION === */}
      <main className="flex-1 relative z-20 flex items-center justify-center px-6 sm:px-10 lg:px-20 xl:px-28 pt-10 pb-10 overflow-hidden">
        <motion.section
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          {/* LEFT SIDE */}
          <div className="flex flex-col items-start gap-8">
            <div className="rounded-2xl p-8 bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl border border-white/10 shadow-[0_10px_50px_rgba(2,6,23,0.65)] w-full transition-all duration-500 hover:bg-[rgba(255,255,255,0.07)]">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
              >
                Vespera Ventures
              </motion.h1>

              <motion.p
                className="mt-4 text-white/70 max-w-xl text-base md:text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                The future of team collaboration — sleek, secure, and crafted for high performance.
                Work smarter with fluid boards, real-time updates, and pure focus.
              </motion.p>

              <div className="mt-8 flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 text-white/90 hover:bg-white/10 transition-all"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60">
                {[
                  ["⚡", "Realtime sync"],
                  ["🔒", "End-to-end security"],
                  ["🧭", "Intuitive UI"],
                ].map(([icon, text], i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5 backdrop-blur-md"
                  >
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                ["Kanban Boards", "Flexible boards and drag-and-drop workflow."],
                ["Smart Insights", "Visual reports and analytics at a glance."],
              ].map(([title, desc], i) => (
                <motion.div
                  key={i}
                  variants={featureFade(0.1 * i)}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.04 }}
                  className="rounded-xl p-5 bg-[rgba(255,255,255,0.04)] border border-white/10 backdrop-blur-2xl transition-all"
                >
                  <h4 className="text-white/90 font-semibold mb-1">{title}</h4>
                  <p className="text-white/60 text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE MOCKUP */}
          <div className="flex items-center justify-center">
            <motion.div
              className="relative w-[340px] md:w-[420px] lg:w-[480px] h-[280px] md:h-[340px] lg:h-[400px] rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(2,6,23,0.7)] overflow-hidden"
              animate={floatSlow.animate}
              transition={floatSlow.transition}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-12 -top-12 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl" />
                <div className="absolute right-6 bottom-6 w-36 h-36 bg-cyan-400/10 rounded-full blur-2xl" />
              </div>
              <div className="absolute inset-5 rounded-xl bg-gradient-to-b from-white/4 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-28 rounded-full bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="col-span-2 h-28 rounded-lg bg-white/6 border border-white/6" />
                  <div className="h-28 rounded-lg bg-white/7 border border-white/6" />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                  <div>Board • Today</div>
                  <div>4 tasks</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* === FOOTER === */}
      <footer className="border-t border-white/10 py-4 text-center text-sm text-white/50 backdrop-blur-xl bg-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-1">
          <div>© {new Date().getFullYear()} Vespera Ventures</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/60 hover:text-white/90">
              Privacy
            </a>
            <a href="#" className="text-white/60 hover:text-white/90">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
