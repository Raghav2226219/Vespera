import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Column from "../components/Column";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/board/${boardId}`);
      setBoard(res.data);
    } catch (err) {
      console.error("Error fetching board details:", err);
      setError("Failed to load board details.");
    }
  };

  const fetchColumns = async () => {
    try {
      const res = await api.get(`/columns/${boardId}`);
      setColumns(res.data);
    } catch (err) {
      console.error("Error fetching columns:", err);
      setError("Failed to load columns.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBoard(), fetchColumns()]);
      setLoading(false);
    };
    loadData();
  }, [boardId]);

  // ✅ Create task → goes to "To Do" column
const handleCreateTask = async (e) => {
  e.preventDefault();
  if (!newTask.title.trim()) {
    alert("Task title is required.");
    return;
  }

  setCreating(true);
  try {
    // 1️⃣ Fetch columns to find the "To Do" column
    const colRes = await api.get(`/columns/${boardId}`);
    const todoColumn = colRes.data.find(
      (col) => col.name.toLowerCase() === "to do"
    );

    if (!todoColumn) {
      alert('No "To Do" column found. Please create one first.');
      setCreating(false);
      return;
    }

    // 2️⃣ Create task under that column
    await api.post(`/tasks/${boardId}/${todoColumn.id}`, {
      title: newTask.title,
      description: newTask.description,
    });

    setShowTaskModal(false);
    setNewTask({ title: "", description: "" });
    await fetchColumns();
  } catch (err) {
    console.error("Error creating task:", err);
    alert("Failed to create task.");
  } finally {
    setCreating(false);
  }
};


  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-red-400 text-lg font-semibold">
        {error}
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8 overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Header */}
      <div className="relative z-10 backdrop-blur-lg bg-white/5 px-6 py-5 md:px-8 md:py-6 rounded-2xl border border-white/10 shadow-xl mb-10 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
            {board?.title || "Untitled Board"}
          </h1>
          <p className="text-emerald-200/80 mt-2 text-sm md:text-base max-w-2xl">
            {board?.description || "No description provided."}
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-xl shadow-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          + Add Task
        </button>
      </div>

      {/* Columns Section */}
      <div
        className="
          flex flex-wrap md:flex-nowrap
          justify-start
          gap-6 md:gap-8
          pl-6 md:pl-12 lg:pl-24
          pr-4 md:pr-6
          pb-8
        "
      >
        {columns.length > 0 ? (
          columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-[290px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
            >
              <Column
                column={column}
                boardId={boardId}
                refreshColumns={fetchColumns}
              />
            </div>
          ))
        ) : (
          <div className="text-emerald-200/70 text-center w-full">
            No columns yet. Create one to get started!
          </div>
        )}
      </div>

      {/* ✅ Add Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-emerald-300 mb-4">
                Create New Task
              </h2>

              <form onSubmit={handleCreateTask} className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                ></textarea>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600/30 text-gray-200 hover:bg-gray-600/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-all"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardPage;
