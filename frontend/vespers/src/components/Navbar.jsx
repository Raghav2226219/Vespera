import { motion } from "framer-motion";
import { LogOut, Bell, User, LayoutDashboard, Menu } from "lucide-react";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  setShowNotifications,
  navigate,
  handleLogout,
}) => {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg z-50"
    >
      <div className="flex items-center gap-3">
        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/80 hover:text-emerald-400 transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
          <LayoutDashboard className="w-6 h-6" />
          Vespera
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* 🔔 Notification Button */}
        <button
          onClick={() => setShowNotifications(true)}
          className="hover:text-emerald-300 transition"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* 👤 Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="hover:text-emerald-300 transition"
        >
          <User className="w-5 h-5" />
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;
