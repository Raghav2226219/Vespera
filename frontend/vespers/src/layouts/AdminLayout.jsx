import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Users, LayoutDashboard, Settings, LogOut, Shield, Bell, Layout, CheckSquare, Mail, Activity, DollarSign, Sliders, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";
import NotificationPanel from "../components/NotificationPanel";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "Admin") {
      navigate("/dashboard");
    }
    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await api.post("/user/logout", { refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/boards", label: "Boards", icon: Layout },
    { path: "/admin/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/admin/invites", label: "Invites", icon: Mail },
    { path: "/admin/activity", label: "Activity", icon: Activity },
    { path: "/admin/premium", label: "Premium", icon: DollarSign },
    { path: "/admin/platform", label: "Platform", icon: Sliders },
    { path: "/admin/logs", label: "Logs", icon: Terminal },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0b1914] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0b1914]/95 backdrop-blur-xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 font-medium">Vespera System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-yellow-200 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  // isActive check inside className is tricky with NavLink function, so relying on parent class
                  "group-[.active]:text-yellow-400"
                }`}
              />
              <span className="font-medium">{item.label}</span>
              
              {/* Active Indicator */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] relative">
        {/* Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/5 blur-[100px] rounded-full" />
        </div>

        {/* Top Bar with Notifications */}
        <div className="absolute top-6 right-8 z-20">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-yellow-200"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-[#0b1914]" />
            )}
          </button>
        </div>

        <div className="relative z-10 p-8 max-w-7xl mx-auto mt-12">
          <Outlet />
        </div>

        <NotificationPanel
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
        />
      </main>
    </div>
  );
};

export default AdminLayout;
