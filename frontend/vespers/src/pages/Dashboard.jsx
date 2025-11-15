import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "../components/LeftSidebar";
import Navbar from "../components/Navbar";
import VesperaHologram from "../components/VesperaHologram";
import NotificationPanel from "../components/NotificationPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await api.post("/user/logout", { refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-white overflow-hidden relative">
      {/* 🌟 Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowNotifications={setShowNotifications}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 relative">
        {/* 🌙 Sidebar */}
        <LeftSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 🔲 Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* 🌈 Main Dashboard */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10 relative overflow-hidden">
          {/* 💫 Ambient Background Lights */}
          <motion.div
            animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 right-0 w-[26rem] h-[26rem] bg-lime-400/10 blur-[120px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-0 w-[28rem] h-[28rem] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none"
          />

          {/* ✨ Floating particles */}
          {[...Array(28)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute block h-[3px] w-[3px] rounded-full bg-yellow-300/80"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "drop-shadow(0 0 10px rgba(255,255,150,0.9))",
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 🧩 Logo + Greeting */}
          <div className="flex flex-col items-center justify-center mb-8">
            <VesperaHologram />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold mt-6 bg-clip-text text-transparent 
                         bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-200 
                         drop-shadow-[0_0_25px_rgba(255,255,150,0.4)]"
            >
              Welcome back,&nbsp;
              <span className="bg-gradient-to-r from-lime-300 via-green-300 to-yellow-300 bg-clip-text text-transparent">
                {user?.name || "Explorer"}
              </span>{" "}
              🌿
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="text-lg text-yellow-200/70 mt-3 leading-relaxed max-w-lg"
            >
              “Consistency beats intensity — keep pushing forward and build the extraordinary.”
            </motion.p>
          </div>

          {/* 🧭 Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            {/* Boards Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/boards")}
              className="px-6 py-3 rounded-xl font-semibold text-gray-900 
                         bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300
                         shadow-[0_0_25px_rgba(255,255,150,0.3)]
                         hover:shadow-[0_0_35px_rgba(255,255,150,0.45)]
                         transition-all duration-300"
            >
              Go to Boards
            </motion.button>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/newboard")}
              className="px-6 py-3 rounded-xl font-semibold text-gray-900 
                         bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-300
                         shadow-[0_0_25px_rgba(255,255,150,0.35)]
                         hover:shadow-[0_0_40px_rgba(255,255,150,0.45)]
                         transition-all duration-300"
            >
              Create New Board
            </motion.button>
          </motion.div>
        </main>
      </div>

      {/* 🔔 Notifications (separated component) */}
      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default Dashboard;
