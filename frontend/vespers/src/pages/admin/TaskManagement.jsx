import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, CheckSquare, AlertCircle, Loader2 } from "lucide-react";
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

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [graphData, setGraphData] = useState([]);
  const [pieData, setPieData] = useState({
    status: [],
    priority: [],
    dueDate: [],
  });

  useEffect(() => {
    fetchTasks();
    fetchGraphData();
    fetchPieData();
  }, [page, search]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/tasks?page=${page}&limit=10&search=${search}`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const res = await api.get("/admin/graph-stats");
      setGraphData(res.data.tasks);
    } catch (err) {
      console.error("Error fetching graph stats:", err);
    }
  };

  const fetchPieData = async () => {
    try {
      const res = await api.get("/admin/task-stats");
      setPieData(res.data);
    } catch (err) {
      console.error("Error fetching pie stats:", err);
    }
  };

  const COLORS = {
    status: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
    priority: ["#10b981", "#f59e0b", "#ef4444"], // Low, Medium, High
    dueDate: ["#ef4444", "#f59e0b", "#10b981", "#6b7280"], // Overdue, Due Soon, Future, No Due Date
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
        <h1 className="text-3xl font-bold text-white">Task Management</h1>
        <p className="text-gray-400 mt-2">Monitor all tasks across boards.</p>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderPieChart("Task Status", pieData.status, COLORS.status)}
        {renderPieChart("Task Priority", pieData.priority, COLORS.priority)}
        {renderPieChart("Due Dates", pieData.dueDate, COLORS.dueDate)}
      </div>

      {/* Line Graph Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Tasks Created (Last 7 Days)</h2>
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
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6" }}
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
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-4">Task</th>
                <th className="p-4">Board</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <CheckSquare className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-white">{task.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{task.boardTitle}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "HIGH"
                            ? "bg-red-500/10 text-red-400"
                            : task.priority === "MEDIUM"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default TaskManagement;
