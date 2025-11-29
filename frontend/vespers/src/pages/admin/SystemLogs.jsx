import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  AlertCircle,
  Mail,
  Activity,
  RefreshCw,
  Download,
  Search,
  Filter,
} from "lucide-react";
import api from "../../api/axios";

const SystemLogs = () => {
  const [activeTab, setActiveTab] = useState("server");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logType, setLogType] = useState("combined"); // combined or error for server logs

  useEffect(() => {
    fetchLogs();
  }, [activeTab, logType]);

  const fetchLogs = async () => {
    setLoading(true);
    setLogs([]); // ✅ Clear logs to prevent type mismatch on tab switch
    try {
      let endpoint = "";
      if (activeTab === "server") endpoint = `/admin/logs/server?type=${logType}`;
      else if (activeTab === "email") endpoint = "/admin/logs/email";
      else if (activeTab === "socket") endpoint = "/admin/logs/socket";

      const res = await api.get(endpoint);
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };



  const downloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(logs, null, 2)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTab}-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-yellow-500" /> System Logs
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor server activity, errors, emails, and socket connections.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={downloadLogs}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Download Logs"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-lg w-fit">
        {[
          { id: "server", label: "Server Logs", icon: Terminal },
          { id: "email", label: "Email Logs", icon: Mail },
          { id: "socket", label: "Socket Logs", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-yellow-500 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#0b1914]/90 border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        {activeTab === "server" && (
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
            <div className="flex gap-2">
              <button
                onClick={() => setLogType("combined")}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  logType === "combined"
                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                Combined
              </button>
              <button
                onClick={() => setLogType("error")}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  logType === "error"
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : "border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                Errors Only
              </button>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Showing last 100 lines
            </span>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No logs found.
            </div>
          ) : activeTab === "server" ? (
            <div className="space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="break-all hover:bg-white/5 p-1 rounded">
                  <span className="text-gray-500 mr-2">
                    {log.timestamp || new Date().toISOString()}
                  </span>
                  <span
                    className={
                      log.level === "error" ? "text-red-400" : "text-green-400"
                    }
                  >
                    [{log.level?.toUpperCase() || "INFO"}]
                  </span>{" "}
                  <span className="text-gray-300">
                    {log.message || JSON.stringify(log)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-gray-500 border-b border-white/10 sticky top-0 bg-[#0b1914]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="p-3 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-white">
                      {log.user?.name || "System"}
                      <div className="text-xs text-gray-500">
                        {log.user?.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.action?.includes("ERROR") ||
                          log.action?.includes("DISCONNECT")
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {log.action || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">
                      {typeof log.details === "object"
                        ? JSON.stringify(log.details)
                        : log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
