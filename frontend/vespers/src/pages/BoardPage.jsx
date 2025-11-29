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

  const lastStableColumns = useRef([]);

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
    if (!newTask.title.trim()) {
      alert("Task title is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.get(`/columns/${boardId}`);
      const todoColumn = res.data.find(
        (col) => col.name.toLowerCase() === "to do"
      );

      if (!todoColumn) {
        alert('No "To Do" column found.');
        setCreating(false);
        return;
      }

      const taskRes = await api.post(`/tasks/${boardId}/${todoColumn.id}`, {
        title: newTask.title,
        description: newTask.description,
      });

      setColumns((prevCols) => {
        const updated = prevCols.map((col) =>
          col.id === todoColumn.id
            ? { ...col, tasks: [...col.tasks, taskRes.data] }
            : col
        );
        lastStableColumns.current = updated;
        return updated;
      });

      setShowTaskModal(false);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task.");
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

    const previousColumns = lastStableColumns.current;

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

      {/* Members List Modal */}
      <MembersListModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={board?.members || []}
      />
    </div>
  );
};

export default BoardPage;
