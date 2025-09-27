import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// Smooth floating + rotation
const floatAnim = {
  animate: { y: [0, -10, 0], rotate: [0, 1, -1, 0] },
  transition: {
    duration: 10,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

// Shimmer animation for button
const shimmerAnim = {
  initial: { backgroundPosition: "200% 0" },
  animate: { backgroundPosition: "-200% 0" },
  transition: { duration: 3, repeat: Infinity, ease: "linear" },
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/user/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 relative overflow-hidden">
      {/* Background glow blobs */}
      <motion.div
        animate={{ x: [0, 25, -25, 0], y: [0, -25, 25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 -top-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 bottom-10 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl mx-4 md:mx-8 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col md:flex-row bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700">
          
          {/* LEFT: Form */}
          <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-300 flex items-center justify-center border border-white/10 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/90">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm text-white/70 font-medium">Vespera</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
              className="text-3xl sm:text-4xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-amber-200 to-white font-extrabold tracking-tight"
            >
              Vespera Ventures
            </motion.h1>

            <p className="mt-2 text-sm md:text-base text-emerald-200/70 max-w-[38ch]">
              A New Beginning — sign in to continue to your workspace.
            </p>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
              className="mt-6 space-y-4 w-full"
            >
              {/* Error Alert - fixed height */}
              <div className="h-10">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="text-sm text-rose-200 bg-rose-700/30 px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Inputs */}
              <label className="block">
                <span className="text-xs text-white/60">Email</span>
                <input
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Password</span>
                  <button type="button" className="text-xs text-white/40 hover:text-white/70">
                    Forgot?
                  </button>
                </div>
                <input
                  aria-label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  placeholder="••••••••"
                />
              </label>

              {/* Sign In Button with shimmer */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial="initial"
                animate="animate"
                transition={shimmerAnim.transition}
                variants={shimmerAnim}
                type="submit"
                className="relative w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-gray-900 font-semibold shadow-lg overflow-hidden
                  bg-[linear-gradient(120deg,#34d399,#06b6d4,#34d399)] bg-[length:200%_100%]"
              >
                Sign In
              </motion.button>
            </motion.form>

            <p className="mt-6 text-sm text-white/60">
              Don’t have an account?{" "}
              <Link to="/register" className="text-emerald-300 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>

          {/* RIGHT: Illustration */}
          <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center p-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]">
            <div className="absolute inset-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-80 h-80 rounded-2xl flex items-center justify-center"
              animate={floatAnim.animate}
              transition={floatAnim.transition}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-400/6 flex items-center justify-center border border-white/8 shadow-lg">
                <motion.img
                  src="https://cdn-icons-png.flaticon.com/512/3448/3448616.png"
                  alt="kanban illustration"
                  className="w-40 h-40 object-contain filter drop-shadow-[0_10px_40px_rgba(6,95,70,0.18)]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
            <div className="absolute -bottom-12 right-8 w-44 h-44 rounded-full bg-emerald-400/8 blur-3xl" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
