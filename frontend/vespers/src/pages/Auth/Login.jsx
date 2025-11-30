import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import VesperaHologram from "../../components/VesperaHologram";
import NotAdminPopup from "../../components/auth/NotAdminPopup";

const Login = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showNotAdminPopup, setShowNotAdminPopup] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const userStr = localStorage.getItem("user");
      console.log("Login Check - adminOnly:", adminOnly);
      console.log("Login Check - userStr:", userStr);

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log("Login Check - Parsed User:", user);
          
          if (adminOnly) {
            const role = user.role || "";
            console.log("Login Check - Role:", role);
            
            // Case-insensitive check for extra safety
            if (role.toLowerCase() !== "admin") {
              console.log("Login Check - Access Denied. Showing Popup.");
              setShowNotAdminPopup(true);
              // Do NOT navigate
            } else {
              console.log("Login Check - Access Granted. Navigating to Dashboard.");
              navigate("/dashboard");
            }
          } else {
            console.log("Login Check - Not Admin Route. Navigating to Dashboard.");
            navigate("/dashboard");
          }
        } catch (e) {
          console.error("Login Check - Error parsing user:", e);
          // If error, let them login again (do nothing)
        }
      }
    };
    checkSession();
  }, [adminOnly, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/user/login", { email, password });
      console.log("Login Submit - Response:", res.data);
      
      // Admin Only Check
      if (adminOnly) {
        const role = res.data.user.role || "";
        if (role.toLowerCase() !== "admin") {
          throw new Error("Access Denied: Admins only.");
        }
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.log("Login Submit - Error:", err.message);
      if (err.message === "Access Denied: Admins only.") {
        // Show the popup instead of setting error text
        setShowNotAdminPopup(true);
        // Clear any partial session data if backend set cookies
        await api.post("/user/logout").catch(() => {}); 
      } else {
        setError(err?.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white overflow-hidden">
      {/* 🚨 Not Admin Popup */}
      <NotAdminPopup show={showNotAdminPopup} onClose={() => setShowNotAdminPopup(false)} />

      {/* 🌌 Ambient Light Orbs */}
      <motion.div
        animate={{ x: [0, 25, -25, 0], y: [0, -25, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0 w-[22rem] h-[22rem] rounded-full bg-lime-400/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 bottom-0 w-[26rem] h-[26rem] rounded-full bg-yellow-400/10 blur-3xl"
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* ✨ Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block h-[3px] w-[3px] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor:
                Math.random() > 0.5 ? "rgba(190,255,150,0.9)" : "rgba(255,255,150,0.9)",
              filter: "drop-shadow(0 0 10px rgba(200,255,180,0.9))",
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

      {/* 🔮 Central Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-[90%] max-w-md flex flex-col items-center text-center space-y-8 overflow-hidden"
      >
        {/* 🧩 Vespera Logo */}
        <div className="w-40">
          <VesperaHologram />
        </div>

        {/* Title + Scanning Line */}
        <div className="relative w-full flex flex-col items-center overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(190,255,150,0.5)]"
          >
            {adminOnly ? "Admin Access Portal" : "Vespera Access Portal"}
          </motion.h1>

          <motion.div
            className="absolute bottom-[-10px] w-[70%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/40 to-transparent rounded-full overflow-hidden"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="h-full w-[18%] bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
              animate={{ x: ["-10%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* 🧬 Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative bg-[rgba(10,26,22,0.55)] border border-lime-400/25 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(190,255,150,0.2)] px-8 py-8 w-full text-left space-y-5"
          whileHover={{
            boxShadow:
              "0 0 55px rgba(255,255,150,0.18), inset 0 0 10px rgba(190,255,150,0.2)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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

          {/* Email Field */}
          <div>
            <label className="text-xs text-white/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:shadow-[0_0_10px_rgba(190,255,150,0.3)] transition-all"
              placeholder="you@vespera.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60">Password</label>
              <Link
                to="#"
                className="text-xs text-yellow-200/80 hover:text-yellow-100"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:shadow-[0_0_10px_rgba(190,255,150,0.3)] transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-lime-200/70 hover:text-yellow-100 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3 rounded-xl text-gray-900 font-semibold 
                       bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 
                       hover:shadow-[0_0_35px_rgba(190,255,150,0.4)]
                       transition-all duration-300"
            type="submit"
          >
            Access System
          </motion.button>
        </motion.form>

        <p className="text-sm text-white/60">
          New to the system?{" "}
          <Link
            to="/register"
            className="text-lime-300 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
