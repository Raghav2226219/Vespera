import { motion } from "framer-motion";
import { LogOut, Bell, User, Menu } from "lucide-react";

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
      className="relative w-full backdrop-blur-2xl 
                 bg-gradient-to-b from-[#0a1410]/90 via-[#132b23]/70 to-[#162f27]/80 
                 border-b border-yellow-300/20 shadow-[0_0_25px_rgba(255,255,120,0.15)]
                 px-6 py-4 flex justify-between items-center z-[100]"
    >
      {/* 🌟 Animated Energy Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-300/80 to-transparent"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Left Section — Title */}
      <div className="flex items-center gap-3">
        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-yellow-200/70 hover:text-yellow-300 transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 🌈 Brand Title */}
        <h1 className="text-2xl font-extrabold flex items-center gap-2 tracking-wide 
                       bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                       bg-clip-text text-transparent 
                       drop-shadow-[0_0_10px_rgba(255,255,150,0.4)]">
          Vespera
        </h1>
      </div>

      {/* Right Section — Controls */}
      <div className="flex items-center gap-6">
        {/* 🔔 Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotifications(true)}
          className="relative text-yellow-200/70 hover:text-yellow-300 transition"
        >
          <Bell className="w-5 h-5" />
          {/* 🔆 Subtle Pulse Indicator */}
          <motion.span
            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(255,255,120,0.6)]"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* 👤 Profile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          className="text-yellow-200/80 hover:text-yellow-300 transition"
        >
          <User className="w-5 h-5" />
        </motion.button>

        {/* 🚪 Logout */}
        <motion.button
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 18px rgba(255,255,120,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 
                     px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-900 
                     transition-all duration-300 shadow-[0_0_20px_rgba(255,255,120,0.25)] 
                     hover:shadow-[0_0_30px_rgba(255,255,150,0.4)]"
        >
          <LogOut className="w-4 h-4" /> Logout
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Navbar;
