import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Column from "../components/Column";
import Loader from "../components/Loader";
import AddTaskModal from "../components/AddTaskModal";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const lastStableColumns = useRef([]);

  const fetchBoard = useCallback(async () => {
    try {
      const res = await api.get(`/board/${boardId}`);
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

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBoard(), fetchColumns()]);
      setLoading(false);
    };
    loadData();
  }, [fetchBoard, fetchColumns]);

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

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-red-400 text-lg font-semibold">
        {error}
      </div>
    );

  return (
    <div className="relative h-screen overflow-y-hidden bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-4 md:p-8">
      {/* Header Section (Extracted) */}
      <AddTaskModal board={board} onAddTaskClick={() => setShowTaskModal(true)} />

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

      {/* Modal */}
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
