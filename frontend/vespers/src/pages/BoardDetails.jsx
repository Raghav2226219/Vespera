import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import api from "../api/axios";
import Loader from "../components/Loader"; // ✅ import your loader

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900">
        <Loader /> {/* ✅ show loader here */}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-red-400 font-semibold">
        Board not found.
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-300 hover:text-emerald-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
      </div>

      {/* Board Header */}
      <motion.div
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-8"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-emerald-300">
              {board.title}
            </h1>
            <p className="text-emerald-200/70 mt-1">
              {board.description || "No description provided"}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${
              board.status === "active"
                ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                : board.status === "archived"
                ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                : "bg-red-400/20 text-red-300 border border-red-400/30"
            }`}
          >
            {board.status.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-8">
        {/* Timestamps */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-emerald-400/30 hover:shadow-emerald-400/20 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="flex items-center text-lg font-semibold text-emerald-300 mb-3">
            <Calendar className="w-5 h-5 mr-2" /> Timestamps
          </h2>
          <div className="space-y-2 text-emerald-200/80">
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(board.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(board.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Archived At:</strong>{" "}
              {board.archivedAt
                ? new Date(board.archivedAt).toLocaleString()
                : "—"}
            </p>
            <p>
              <strong>Trashed At:</strong>{" "}
              {board.trashedAt
                ? new Date(board.trashedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </motion.div>

        {/* Ownership */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-emerald-400/30 hover:shadow-emerald-400/20 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="flex items-center text-lg font-semibold text-emerald-300 mb-3">
            <User className="w-5 h-5 mr-2" /> Ownership
          </h2>
          <div className="space-y-2 text-emerald-200/80">
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
    </motion.div>
  );
};

export default BoardDetails;
