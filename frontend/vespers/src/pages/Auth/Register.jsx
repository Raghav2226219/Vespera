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

const floatAnim = {
  animate: { y: [0, -10, 0], rotate: [0, 1, -1, 0] },
  transition: {
    duration: 10,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/user/register", form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 overflow-hidden">
      {/* Floating background lights */}
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

      {/* Glass card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl mx-4 md:mx-8 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col md:flex-row bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10">
          {/* Left Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-300 flex items-center justify-center border border-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/90"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-sm text-white/70 font-medium">Vespera</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-amber-200 to-white font-extrabold tracking-tight">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-emerald-200/70">
              Join the Vespera workspace and start your journey today.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {error && (
                <div className="text-sm text-rose-200 bg-rose-700/30 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Two-column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-white/60">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="John Doe"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-white/60">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="you@company.com"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-white/60">Phone Number</span>
                  <input
                    name="phonenumber"
                    type="tel"
                    value={form.phonenumber}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="+91 9876543210"
                  />
                </label>

                {/* Role dropdown — matched styling */}
                <label className="block">
                  <span className="text-xs text-white/60">Role</span>
                  <div className="relative mt-1">
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 hover:bg-white/10 transition-all duration-300"
                    >
                      <option value="">Select a role</option>
                      <option value="Admin" className="text-black">
                        Admin
                      </option>
                      <option value="Owner" className="text-black">
                        Owner
                      </option>
                      <option value="Editor" className="text-black">
                        Editor
                      </option>
                      <option value="Viewer" className="text-black">
                        Viewer
                      </option>
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="rgba(255,255,255,0.6)"
                      className="w-4 h-4 absolute right-3 top-3 pointer-events-none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-white/60">Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="••••••••"
                />
              </label>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 rounded-xl text-gray-900 font-semibold bg-[linear-gradient(120deg,#34d399,#06b6d4,#34d399)] bg-[length:200%_100%] animate-shimmer shadow-lg"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </motion.button>
            </form>

            <p className="mt-4 text-sm text-white/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-300 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]">
            <motion.div
              className="w-72 h-72 rounded-2xl flex items-center justify-center border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-400/10 shadow-lg"
              animate={floatAnim.animate}
              transition={floatAnim.transition}
            >
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                alt="Register Illustration"
                className="w-36 h-36 object-contain drop-shadow-[0_10px_40px_rgba(6,95,70,0.18)]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
