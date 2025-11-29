import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import api from "../api/axios";
import Loader from "../components/Loader";

const BoardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/board/${id}/info`);
        setBoard(res.data);
      } catch (err) {
        console.error("Error fetching board details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29]">
        <Loader />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-yellow-300 font-semibold">
        Board not found.
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-white px-6 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 🌌 Ambient Lights & Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,150,0.1),transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/30 to-transparent"
        />
      </div>

      {/* 🧭 Back Button */}
      <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-300 hover:text-yellow-200 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <motion.span
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border shadow-md ${
            board.status === "active"
              ? "border-lime-400/30 bg-lime-400/10 text-lime-300"
              : board.status === "archived"
              ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
              : "border-red-400/30 bg-red-400/10 text-red-300"
          }`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {board.status.toUpperCase()}
        </motion.span>
      </div>

      {/* 🏛 Board Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-5xl mx-auto bg-gradient-to-br from-[#101d17]/90 via-[#1a3526]/80 to-[#1f4330]/90 
                   border border-yellow-400/20 rounded-3xl backdrop-blur-2xl 
                   shadow-[0_0_40px_rgba(255,255,150,0.15)] p-6 overflow-hidden"
      >
        {/* Animated holo line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 drop-shadow-[0_0_18px_rgba(255,255,150,0.3)]">
            {board.title}
          </h1>
          <p className="text-lime-100/80 mt-2 text-base leading-relaxed">
            {board.description || "No description provided."}
          </p>
        </div>
      </motion.div>

      {/* 📊 Details Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 mt-6">
        {/* 🕒 Timestamps */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                     border border-yellow-400/25 rounded-2xl p-5 backdrop-blur-xl 
                     shadow-[0_0_25px_rgba(255,255,150,0.1)] hover:shadow-[0_0_40px_rgba(255,255,150,0.25)]"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse" />
          <h2 className="flex items-center text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 mb-3 drop-shadow-[0_0_10px_rgba(255,255,150,0.25)]">
            <Calendar className="w-4 h-4 mr-2 text-yellow-300" />
            Timestamps
          </h2>
          <div className="space-y-2 text-lime-100/85 text-sm">
            <p>
              <strong>Created:</strong> {new Date(board.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong> {new Date(board.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Archived:</strong>{" "}
              {board.archivedAt
                ? new Date(board.archivedAt).toLocaleString()
                : "—"}
            </p>
            <p>
              <strong>Trashed:</strong>{" "}
              {board.trashedAt
                ? new Date(board.trashedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </motion.div>

        {/* 👤 Ownership */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                     border border-lime-400/25 rounded-2xl p-5 backdrop-blur-xl 
                     shadow-[0_0_25px_rgba(255,255,150,0.1)] hover:shadow-[0_0_40px_rgba(255,255,150,0.25)]"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse" />
          <h2 className="flex items-center text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 mb-3 drop-shadow-[0_0_10px_rgba(255,255,150,0.25)]">
            <User className="w-4 h-4 mr-2 text-yellow-300" />
            Ownership
          </h2>
          <div className="space-y-2 text-lime-100/85 text-sm">
            <p>
              <strong>Owner:</strong>{" "}
              {board.owner?.name || "—"} ({board.owner?.email || "N/A"})
            </p>
            <p>
              <strong>Archived By:</strong> {board.archivedBy?.name || "—"}
            </p>
            <p>
              <strong>Trashed By:</strong> {board.trashedBy?.name || "—"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 📊 Task Statistics */}
      {board.stats && (
        <div className="max-w-5xl mx-auto mt-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 mb-4 drop-shadow-[0_0_10px_rgba(255,255,150,0.25)]">
            Task Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                         border border-yellow-400/20 rounded-2xl p-4 text-center shadow-lg"
            >
              <h3 className="text-yellow-200/70 text-xs font-medium uppercase tracking-wider mb-1">Total Tasks</h3>
              <p className="text-3xl font-bold text-yellow-300">{board.stats.total}</p>
            </motion.div>

            {/* To Do */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                         border border-red-400/20 rounded-2xl p-4 text-center shadow-lg"
            >
              <h3 className="text-red-200/70 text-xs font-medium uppercase tracking-wider mb-1">To Do</h3>
              <p className="text-3xl font-bold text-red-300">{board.stats.todo}</p>
            </motion.div>

            {/* In Progress */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                         border border-blue-400/20 rounded-2xl p-4 text-center shadow-lg"
            >
              <h3 className="text-blue-200/70 text-xs font-medium uppercase tracking-wider mb-1">In Progress</h3>
              <p className="text-3xl font-bold text-blue-300">{board.stats.inProgress}</p>
            </motion.div>

            {/* Completed */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#0e1c16]/90 via-[#1b3a27]/85 to-[#234433]/90 
                         border border-lime-400/20 rounded-2xl p-4 text-center shadow-lg"
            >
              <h3 className="text-lime-200/70 text-xs font-medium uppercase tracking-wider mb-1">Completed</h3>
              <p className="text-3xl font-bold text-lime-300">{board.stats.completed}</p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BoardDetails;
