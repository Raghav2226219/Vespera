import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Activity, User, Calendar, Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../../api/axios";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: 20,
        ...filters,
      }).toString();
      const res = await api.get(`/admin/activity-logs?${query}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/activity-stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to page 1 on filter change
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const getActionColor = (type) => {
    switch (type) {
      case "SYSTEM": return "text-blue-400";
      case "BOARD": return "text-green-400";
      case "TASK": return "text-yellow-400";
      case "INVITE": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Global Activity Logs</h1>
        <p className="text-gray-400 mt-2">Monitor platform-wide events and user activities.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-4">Activity Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Filters Panel */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Activity Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Types</option>
                <option value="SYSTEM">System (Login/Logout)</option>
                <option value="BOARD">Board</option>
                <option value="TASK">Task</option>
                <option value="INVITE">Invite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="e.g. 123"
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">User</th>
                <th className="p-4">Details</th>
                <th className="p-4">Date</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className={`p-4 font-medium ${getActionColor(log.type)}`}>
                      {log.type}
                    </td>
                    <td className="p-4 text-white">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {log.user?.name || "Unknown"}
                        <span className="text-xs text-gray-500">({log.user?.email})</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{log.details}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-500 text-sm font-mono">
                      {log.ip || "-"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-white/5 text-sm text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-white/5 text-sm text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
