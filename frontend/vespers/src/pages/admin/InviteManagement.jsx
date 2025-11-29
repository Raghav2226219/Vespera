import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, XCircle, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../../api/axios";

const InviteManagement = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [graphData, setGraphData] = useState([]);
  const [pieData, setPieData] = useState({
    status: [],
    role: [],
  });

  useEffect(() => {
    fetchInvites();
    fetchGraphData();
    fetchPieData();
  }, [page, search]);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/invites?page=${page}&limit=10&search=${search}`);
      setInvites(res.data.invites);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching invites:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const res = await api.get("/admin/graph-stats");
      setGraphData(res.data.invites);
    } catch (err) {
      console.error("Error fetching graph stats:", err);
    }
  };

  const fetchPieData = async () => {
    try {
      const res = await api.get("/admin/invite-stats");
      setPieData(res.data);
    } catch (err) {
      console.error("Error fetching pie stats:", err);
    }
  };

  const COLORS = {
    status: ["#f59e0b", "#10b981", "#ef4444", "#6b7280"], // Pending, Accepted, Cancelled, Expired
    role: ["#8b5cf6", "#f59e0b", "#3b82f6"], // Owner, Editor, Viewer
  };

  const renderPieChart = (title, data, colors) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Invite Management</h1>
        <p className="text-gray-400 mt-2">Track and manage board invitations.</p>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPieChart("Invite Status", pieData.status, COLORS.status)}
        {renderPieChart("Invite Role", pieData.role, COLORS.role)}
      </div>

      {/* Line Graph Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Invites Sent (Last 7 Days)</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f59e0b" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Board</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Sent At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : invites.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No invites found.
                  </td>
                </tr>
              ) : (
                invites.map((invite) => (
                  <motion.tr
                    key={invite.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-white">{invite.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{invite.board.title}</td>
                    <td className="p-4 text-gray-300">{invite.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invite.used
                            ? "bg-green-500/10 text-green-400"
                            : invite.cancelled
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {invite.used
                          ? "Accepted"
                          : invite.cancelled
                          ? "Cancelled"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {!invite.used && !invite.cancelled && (
                        <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
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

export default InviteManagement;
