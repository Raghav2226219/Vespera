import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import VesperaHologram from "../../components/VesperaHologram";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/user/register", form);

      const { data } = await api.post("/user/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white overflow-hidden">
      {/* Ambient Orbs */}
      <motion.div
        animate={{ x: [0, 25, -25, 0], y: [0, -25, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0 w-[20rem] h-[20rem] rounded-full bg-emerald-500/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 bottom-0 w-[24rem] h-[24rem] rounded-full bg-yellow-400/10 blur-3xl"
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* Floating Light Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(32)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block h-[3px] w-[3px] rounded-full bg-lime-300/90"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "drop-shadow(0 0 10px rgba(190,255,150,0.9))",
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Central Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-[90%] max-w-2xl flex flex-col items-center text-center space-y-6 overflow-hidden"
      >
        <div className="w-36 mb-3">
          <VesperaHologram />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(190,255,150,0.4)]"
        >
          Create Your Vespera Account
        </motion.h1>

        {/* Scanning Line */}
        <motion.div
          className="w-[65%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/40 to-transparent rounded-full overflow-hidden"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-full w-[18%] bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
            animate={{ x: ["-10%", "100%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative mt-4 bg-[rgba(10,26,22,0.55)] border border-lime-400/25 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(190,255,150,0.2)] px-8 py-7 w-full text-left space-y-5"
          whileHover={{
            boxShadow:
              "0 0 50px rgba(255,255,150,0.15), inset 0 0 10px rgba(190,255,150,0.2)",
          }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-200 bg-rose-700/30 px-3 py-2 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Inputs Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-white/60">Full Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
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
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                placeholder="you@vespera.com"
              />
            </label>
          </div>

          {/* Inputs Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-white/60">Phone Number</span>
              <input
                name="phonenumber"
                type="tel"
                value={form.phonenumber}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                placeholder="+91 9876543210"
              />
            </label>

            <label className="block">
              <span className="text-xs text-white/60">Role</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-lime-400/40"
              >
                <option value="" className="text-black">
                  Select role
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
            </label>
          </div>

          {/* Password */}
          <label className="block">
            <span className="text-xs text-white/60">Password</span>
            <div className="relative mt-1">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-lime-200/70 hover:text-yellow-100 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl text-gray-900 font-semibold 
                       bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 
                       hover:shadow-[0_0_35px_rgba(190,255,150,0.4)]
                       transition-all duration-300"
            type="submit"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </motion.form>

        <p className="text-sm text-white/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-lime-300 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
