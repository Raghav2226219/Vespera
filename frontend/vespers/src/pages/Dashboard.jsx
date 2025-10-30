import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPanel from "../components/NotificationPanel";
import LeftSidebar from "../components/LeftSidebar";
import Navbar from "../components/Navbar";

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
      if (refreshToken) {
        await api.post("/user/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white overflow-hidden">
      {/* 🌟 Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowNotifications={setShowNotifications}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 relative">
        {/* 🌙 Left Sidebar */}
        <LeftSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 🪩 Backdrop Overlay (for mobile) */}
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

        {/* 🌈 Main Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-white drop-shadow-lg">
              Welcome Back, {user?.name || "User"} 🌿
            </h2>
            <p className="text-lg text-emerald-200/80 mb-8 leading-relaxed">
              “Consistency beats intensity — keep pushing forward and build the extraordinary.”
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => navigate("/boards")}
                className="px-6 py-3 bg-[rgba(255,255,255,0.1)] hover:bg-emerald-500/20 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-lg"
              >
                Go to Boards
              </button>
              <button
                onClick={() => navigate("/newboard")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                Create New Task
              </button>
            </motion.div>
          </motion.div>

          {/* 💫 Ambient Background Glow */}
          <motion.div
            animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 right-0 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-0 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"
          />
        </main>
      </div>

      {/* 🔔 Notification Sidebar */}
      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={[
          { message: "Task ‘Update Dashboard UI’ completed ✅", time: "5m ago" },
          { message: "New board ‘Marketing’ created 🌿", time: "2h ago" },
          { message: "You have a pending review request 👀", time: "Yesterday" },
        ]}
      />
    </div>
  );
};

export default Dashboard;
