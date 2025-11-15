import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, id: "overview" },
    { name: "Users", icon: Users, id: "users" },
    { name: "Analytics", icon: BarChart3, id: "analytics" },
    { name: "Security", icon: Shield, id: "security" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white flex overflow-hidden">
      {/* 🌿 Background Glow Effects */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[25rem] h-[25rem] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none"
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* 🧭 Sidebar */}
      <aside className="relative z-10 w-64 h-full bg-gradient-to-b from-[#0a1612]/80 via-[#11241f]/70 to-[#13291f]/70 backdrop-blur-2xl border-r border-lime-400/20 shadow-[4px_0_25px_rgba(190,255,150,0.1)] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-lime-400/10">
          <LayoutDashboard className="text-lime-300" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 mt-4">
          {sidebarItems.map(({ name, icon: Icon, id }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-300 border-l-4 
                ${
                  activeSection === id
                    ? "border-lime-400 bg-lime-400/10 text-lime-200"
                    : "border-transparent text-lime-100/70 hover:text-lime-100 hover:bg-lime-400/5"
                }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </motion.button>
          ))}
        </nav>

        <div className="border-t border-lime-400/10 px-6 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-200"
          >
            <LogOut className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </div>
      </aside>

      {/* 🌈 Main Content Area */}
      <main className="flex-1 relative z-10 p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent"
          >
            {sidebarItems.find((item) => item.id === activeSection)?.name}
          </motion.h2>

          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-lime-200/70 text-sm italic"
          >
            Vespera Admin Suite
          </motion.div>
        </div>

        {/* Dynamic Section Content */}
        <section className="relative">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "settings" && <SettingsSection />}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

/* 🌟 SECTION COMPONENTS */
const SectionCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="rounded-2xl p-6 bg-[rgba(255,255,255,0.04)] border border-lime-400/20 backdrop-blur-xl shadow-[0_0_25px_rgba(190,255,150,0.1)]"
  >
    <h3 className="text-xl font-semibold text-lime-200 mb-3">{title}</h3>
    <div className="text-lime-100/80 text-sm">{children}</div>
  </motion.div>
);

const OverviewSection = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <SectionCard title="Total Users">142</SectionCard>
    <SectionCard title="Active Boards">37</SectionCard>
    <SectionCard title="Pending Invites">18</SectionCard>
  </div>
);

const UsersSection = () => (
  <SectionCard title="User Management">
    Add user CRUD operations here later (list, delete, promote, etc.)
  </SectionCard>
);

const AnalyticsSection = () => (
  <SectionCard title="Analytics Dashboard">
    Will include charts (task activity, user engagement, etc.)
  </SectionCard>
);

const SecuritySection = () => (
  <SectionCard title="Security Center">
    Manage roles, tokens, and system logs here.
  </SectionCard>
);

const SettingsSection = () => (
  <SectionCard title="Admin Settings">
    Modify global app configurations here later.
  </SectionCard>
);
