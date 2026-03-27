import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Column from "../components/Column";
import Loader from "../components/Loader";
import AddTaskModal from "../components/AddTaskModal";
import MembersListModal from "../components/MembersListModal";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";
import { useSocket } from "../context/SocketContext";
import { AlertCircle } from "lucide-react";

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: "" });
  const showCustomToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  const lastStableColumns = useRef([]);
  // Tracks task IDs that this client is currently moving (to suppress own socket echo)
  const pendingMoves = useRef(new Set());

  // Rate Limiting State
  const [lockoutTime, setLockoutTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Formatting function for MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;
    if (lockoutTime > Date.now()) {
      interval = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setLockoutTime(0);
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const fetchBoard = useCallback(async () => {
    try {
      const res = await api.get(`/board/${boardId}`);
      console.log("Fetched board data:", res.data);
      setBoard(res.data);
    } catch (err) {
      console.error("Error fetching board details:", err);
      setError("Failed to load board details.");
    }
  }, [boardId]);

  const fetchColumns = useCallback(async () => {
    try {
      const res = await api.get(`/columns/${boardId}`);
      setColumns(res.data);
      lastStableColumns.current = res.data;
    } catch (err) {
      console.error("Error fetching columns:", err);
      setError("Failed to load columns.");
    }
  }, [boardId]);

  // 🔌 Socket.IO Integration
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !boardId) return;

    // Join the board room
    socket.emit("join:board", boardId);

    // 👂 Listen for Task Created
    socket.on("task:created", (newTask) => {
      setColumns((prevCols) => {
        const updated = prevCols.map((col) =>
          col.id === newTask.columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        );
        lastStableColumns.current = updated;
        return updated;
      });
    });

    // 👂 Listen for Task Updated
    socket.on("task:updated", (updatedTask) => {
      setColumns((prevCols) => {
        const updated = prevCols.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          ),
        }));
        lastStableColumns.current = updated;
        return updated;
      });
    });

    // 👂 Listen for Task Moved
    socket.on("task:moved", ({ taskId, sourceColumnId, targetColumnId, newPosition, task }) => {
      // ✅ Skip if this is our own move — we already applied it optimistically in handleDragEnd
      // Normalize to string to avoid int vs string mismatch from Prisma vs DnD
      if (pendingMoves.current.has(taskId.toString())) {
        pendingMoves.current.delete(taskId.toString());
        return;
      }

      setColumns((prevCols) => {
        // Deep copy to avoid mutation issues
        const updated = prevCols.map(col => ({
          ...col,
          tasks: [...col.tasks]
        }));

        const sourceCol = updated.find(c => c.id === sourceColumnId);
        const destCol = updated.find(c => c.id === targetColumnId);

        if (!sourceCol || !destCol) return prevCols;

        // Remove from source
        const taskIndex = sourceCol.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return prevCols;

        const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

        // Update task properties if provided, otherwise use existing
        const taskToInsert = task ? { ...task } : { ...movedTask, columnId: targetColumnId };

        // Insert into destination
        destCol.tasks.splice(newPosition, 0, taskToInsert);

        lastStableColumns.current = updated;
        return updated;
      });
    });

    // 👂 Listen for Task Deleted
    socket.on("task:deleted", ({ taskId, columnId }) => {
      setColumns((prevCols) => {
        const updated = prevCols.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col
        );
        lastStableColumns.current = updated;
        return updated;
      });
    });

    return () => {
      socket.emit("leave:board", boardId);
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:moved");
      socket.off("task:deleted");
    };
  }, [socket, boardId]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBoard(), fetchColumns()]);
      setLoading(false);
    };
    loadData();
  }, [fetchBoard, fetchColumns]);

  // ✅ Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (lockoutTime > Date.now()) return;

    if (!newTask.title.trim()) {
      showCustomToast("Task title is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.get(`/columns/${boardId}`);
      const todoColumn = res.data.find(
        (col) => col.name.toLowerCase() === "to do"
      );

      if (!todoColumn) {
        showCustomToast('No "To Do" column found.');
        setCreating(false);
        return;
      }

      await api.post(`/tasks/${boardId}/${todoColumn.id}`, {
        title: newTask.title,
        description: newTask.description,
      });

      // ✅ Don't manually update columns here — the socket "task:created" event
      // will fire and add the task to state, preventing duplicate cards.

      setShowTaskModal(false);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating task:", err);
      if (err.response?.status === 429 && err.response?.data?.retryAfterMs) {
        const retryMs = err.response.data.retryAfterMs;
        setLockoutTime(Date.now() + retryMs);
        setTimeLeft(retryMs);
        showCustomToast(`Rate limit reached. You can create a new task in ${formatTime(retryMs)}.`);
      } else {
        showCustomToast(err.response?.data?.message || "Failed to create task.");
      }
    } finally {
      setCreating(false);
    }
  };

  // ✅ Delete task
  const handleTaskDelete = async (taskId, columnId) => {
    const previousColumns = lastStableColumns.current;

    setColumns((prevCols) => {
      const updated = prevCols.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      );
      lastStableColumns.current = updated;
      return updated;
    });

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
      setColumns(previousColumns);
      lastStableColumns.current = previousColumns;
    }
  };

  // ✅ Edit task (instant UI update)
  const handleTaskUpdate = async (updatedTask) => {
    try {
      setColumns((prevCols) => {
        const updated = prevCols.map((col) => {
          if (!col.tasks) return col;
          return {
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            ),
          };
        });
        lastStableColumns.current = updated;
        return updated;
      });

      await api.put(`/tasks/${updatedTask.id}`, {
        title: updatedTask.title,
        description: updatedTask.description,
      });
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task.");
    }
  };

  // ✅ Handle drag and drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskKey = draggableId.toString();
    const previousColumns = lastStableColumns.current;

    // ✅ Mark this task as a pending own-move so the socket echo is ignored
    pendingMoves.current.add(taskKey);

    setColumns((prevCols) => {
      const updated = prevCols.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      const sourceCol = updated.find(
        (c) => c.id.toString() === source.droppableId
      );
      const destCol = updated.find(
        (c) => c.id.toString() === destination.droppableId
      );

      if (!sourceCol || !destCol) return prevCols;

      const [movedTask] = sourceCol.tasks.splice(source.index, 1);
      movedTask.columnId = destCol.id;
      destCol.tasks.splice(destination.index, 0, movedTask);

      lastStableColumns.current = updated;
      return updated;
    });

    try {
      await api.put(`/tasks/move/${draggableId}`, {
        targetColumnId: destination.droppableId,
        newPosition: destination.index,
      });
    } catch (err) {
      console.error("Error updating task position:", err);
      // Clean up pending move tracking on failure
      pendingMoves.current.delete(taskKey);
      setColumns(previousColumns);
      lastStableColumns.current = previousColumns;
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
    <div className="relative h-screen overflow-y-hidden bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8">
      {/* Header Section */}
      <AddTaskModal
        board={board}
        onAddTaskClick={() => setShowTaskModal(true)}
        onViewMembers={() => setShowMembersModal(true)}
      />

      {/* Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap md:flex-nowrap justify-start gap-6 md:gap-8 pl-6 md:pl-12 lg:pl-24 pr-4 md:pr-6 pb-8">
          {columns.length > 0 ? (
            columns.map((column) => (
              <div
                key={column.id}
                className="flex-shrink-0 w-[290px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
              >
                <Column
                  column={column}
                  boardId={boardId}
                  onTaskDelete={handleTaskDelete}
                  onTaskUpdate={handleTaskUpdate}
                  boardMembers={board?.members || []}
                />
              </div>
            ))
          ) : (
            <div className="text-emerald-200/70 text-center w-full">
              No columns yet. Create one to get started!
            </div>
          )}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-[#080f0c]/95 via-[#0d1f18]/95 to-[#0a1a14]/95 backdrop-blur-2xl border border-lime-400/25 rounded-2xl p-7 w-[90%] max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(150,255,100,0.08)] overflow-hidden"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,180,0.04)_50%,transparent_100%)] animate-[shine_5s_linear_infinite]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-300/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-pulse" />
              </div>

              {/* Header */}
              <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full bg-gradient-to-b from-lime-300 via-yellow-300 to-emerald-400 shadow-[0_0_10px_rgba(200,255,100,0.5)]" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-lime-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(200,255,100,0.4)]">
                  Create New Task
                </h2>
              </div>

              <form onSubmit={handleCreateTask} className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-lime-300/70 uppercase tracking-widest pl-1">Task Title</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full bg-[#0d201a]/70 text-white placeholder-emerald-200/30 border border-lime-400/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-lime-400/60 focus:shadow-[0_0_15px_rgba(150,255,100,0.15)] transition-all duration-200 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-lime-300/70 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    placeholder="Add some details... (optional)"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-[#0d201a]/70 text-white placeholder-emerald-200/30 border border-lime-400/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-lime-400/60 focus:shadow-[0_0_15px_rgba(150,255,100,0.15)] transition-all duration-200 resize-none text-sm custom-scrollbar"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-800/40 border border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 text-sm font-medium backdrop-blur-md"
                  >
                    Cancel
                  </button>
                  {lockoutTime > Date.now() ? (
                    <button
                      type="button"
                      disabled
                      className="px-6 py-2.5 rounded-xl bg-gray-600 border border-gray-500 text-gray-400 font-bold tracking-wide cursor-not-allowed transition-all duration-300 text-sm opacity-60 flex items-center justify-center min-w-[140px]"
                    >
                      Wait ({formatTime(timeLeft)})
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-500/80 to-emerald-600/80 border border-lime-400/50 text-white font-bold tracking-wide hover:from-lime-400 hover:to-emerald-500 hover:shadow-[0_0_20px_rgba(150,255,100,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm shadow-[0_0_15px_rgba(150,255,100,0.2)] flex items-center justify-center min-w-[140px]"
                    >
                      {creating ? "Creating..." : "✦ Create Task"}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members List Modal */}
      <MembersListModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={board?.members || []}
      />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-3 bg-rose-500/10 border border-rose-500/50 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-[0_0_40px_rgba(244,63,94,0.3)] text-white pointer-events-none"
          >
            <AlertCircle className="w-6 h-6 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardPage;
