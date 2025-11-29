import React, { useEffect, useState } from "react";
import { Users, LayoutDashboard, Activity, AlertTriangle, Loader2 } from "lucide-react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBoards: 0,
    totalTasks: 0,
    pendingInvites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active Boards", value: stats.activeBoards, icon: LayoutDashboard, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Tasks", value: stats.totalTasks, icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Pending Invites", value: stats.pendingInvites, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-gray-400 font-medium">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder (Can be updated later) */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-gray-300 text-sm">
              System monitoring active. Real-time logs coming soon.
            </p>
            <span className="ml-auto text-xs text-gray-500">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
