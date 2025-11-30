import React, { useEffect, useState } from "react";
import { Users, LayoutDashboard, Activity, AlertTriangle, Loader2, Mail } from "lucide-react";
import api from "../../api/axios";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBoards: 0,
    totalTasks: 0,
    pendingInvites: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/activity-logs?limit=10"),
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data.logs);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active Boards", value: stats.activeBoards, icon: LayoutDashboard, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Tasks", value: stats.totalTasks, icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Pending Invites", value: stats.pendingInvites, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "SYSTEM": return <Users className="w-4 h-4 text-blue-400" />;
      case "BOARD": return <LayoutDashboard className="w-4 h-4 text-emerald-400" />;
      case "TASK": return <Activity className="w-4 h-4 text-purple-400" />;
      case "INVITE": return <Mail className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

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

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Recent System Activity</h2>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
                <div className="p-2 rounded-lg bg-white/5">
                  {getActivityIcon(log.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 text-sm font-medium">
                    {log.user?.name || "System"} <span className="text-gray-500 font-normal">performed</span> {log.type.toLowerCase()} action
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {log.details && typeof log.details === 'string' 
                      ? log.details 
                      : JSON.stringify(log.details)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
