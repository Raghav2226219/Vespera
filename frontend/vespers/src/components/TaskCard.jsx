import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreVertical, Trash2, Pencil, Users, Check, X, Calendar } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../api/axios";

const PortalAwareItem = ({ provided, snapshot, children }) => {
  const child = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        relative group
        bg-gradient-to-br from-[#0a1812]/80 via-[#11261e]/60 to-[#172e28]/40
        border border-emerald-400/20
        rounded-2xl p-4
        shadow-[0_0_25px_rgba(0,0,0,0.5)]
        backdrop-blur-xl
        transition-all duration-300 cursor-pointer
        ${
          snapshot.isDragging
            ? "scale-105 shadow-[0_0_30px_rgba(255,255,120,0.4)] border-yellow-400/50 bg-[#1a3a26]/90 z-[9999]"
            : "hover:shadow-[0_0_20px_rgba(255,255,150,0.3)] hover:border-yellow-300/30"
        }
      `}
      style={{
        ...provided.draggableProps.style,
        zIndex: snapshot.isDragging ? 9999 : "auto",
      }}
    >
      {/* ✨ Animated border shimmer */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border border-yellow-300/20 blur-[1px]" />
        <div className="absolute inset-0 rounded-2xl border border-emerald-300/20" />
      </div>

      {/* 🌈 Holo line sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,180,0.15)_50%,transparent_100%)] animate-[shine_4s_linear_infinite]" />
      </div>

      {children}
    </div>
  );
  return snapshot.isDragging ? createPortal(child, document.body) : child;
};

const TaskCard = ({ task, index, onDelete, onUpdate, boardMembers = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "MEDIUM");
  const [mentions, setMentions] = useState([]);
  const [mentionsModal, setMentionsModal] = useState(false);
  const [priorityModal, setPriorityModal] = useState(false);
  const [dueDateModal, setDueDateModal] = useState(false);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [confirmRemoveMentionId, setConfirmRemoveMentionId] = useState(null);
  
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    console.log("TaskCard mounted. Board members:", boardMembers);
    const fetchMentions = async () => {
      try {
        const res = await api.get(`/task-mentions/${task.id}`);
        setMentions(res.data);
      } catch (err) {
        console.error("Error fetching mentions:", err);
      }
    };
    fetchMentions();
  }, [task.id]);

  const handleDelete = async () => {
    try {
      await onDelete?.(task.id);
      setMenuOpen(false);
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/tasks/${task.id}`, { title, description, priority });
      onUpdate?.(res.data);
      setEditModal(false);
      setMenuOpen(false);
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    console.log("Updating priority to:", newPriority);
    try {
        const res = await api.put(`/tasks/${task.id}`, { title, description, priority: newPriority });
        console.log("Priority update response:", res.data);
        setPriority(newPriority);
        onUpdate?.(res.data);
        setPriorityModal(false);
        setMenuOpen(false);
    } catch (err) {
        console.error("Error updating priority:", err);
    }
  };

  const handleDueDateUpdate = async (date) => {
    try {
        const res = await api.put(`/tasks/${task.id}`, { title, description, priority, dueDate: date });
        setDueDate(date);
        if (res.data.priority) setPriority(res.data.priority); // Update priority if backend changed it
        onUpdate?.(res.data);
        setDueDateModal(false);
        setMenuOpen(false);
    } catch (err) {
        console.error("Error updating due date:", err);
    }
  };

  const handleAddMention = async (userId) => {
    console.log("Adding mention for user:", userId);
    try {
      const res = await api.post("/task-mentions", { taskId: task.id, userId });
      console.log("Add mention response:", res.data);
      setMentions([...mentions, res.data]);
      // Keep modal open to allow multiple mentions or close it? User said "pop up... to make mentions". 
      // Usually better to keep open if adding multiple, but let's close it for now to match priority behavior or maybe keep open?
      // Let's keep it open so they can add more, but maybe show a success feedback? 
      // For now, I'll just remove the old state call.
      setMentionsModal(false); // Closing it for now as per "pop up... choose... set it" pattern usually implies single action, but mentions can be multiple. 
      // Actually, for mentions, often you want to tag multiple people. 
      // But to keep it simple and consistent with the request "make mentions option workin a pop up", I'll close it.
    } catch (err) {
      console.error("Error adding mention:", err);
    }
  };

  const handleRemoveMention = async (mentionId) => {
    console.log("handleRemoveMention called with ID:", mentionId);
    try {
      await api.delete(`/task-mentions/${mentionId}`);
      console.log("Mention deleted successfully");
      setMentions(mentions.filter((m) => m.id !== mentionId));
    } catch (err) {
      console.error("Error removing mention:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, left: rect.right - 150 });
    setMenuOpen((prev) => !prev);
  };

  const draggableId = (task.id ?? task._id ?? `temp-${index}`).toString();

  const getPriorityColor = (p) => {
    switch (p) {
      case "HIGH": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "MEDIUM": return "text-yellow-300 bg-yellow-300/10 border-yellow-300/20";
      case "LOW": return "text-emerald-300 bg-emerald-300/10 border-emerald-300/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <>
      <Draggable draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
          <PortalAwareItem provided={provided} snapshot={snapshot}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,150,0.4)]">
                {task.title}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority || "MEDIUM")}`}>
                {task.priority || "MEDIUM"}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-emerald-100/70 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* 📅 Due Date Display */}
            {dueDate && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium px-2 py-1 rounded-md w-fit ${
                    new Date(dueDate) < new Date() ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                    <Calendar size={12} />
                    {new Date(dueDate).toLocaleDateString()}
                </div>
            )}

            {/* Mentions Display */}
            {mentions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 relative z-10">
                {mentions.map((mention) => (
                  <div key={mention.id} className="flex items-center gap-1 bg-emerald-900/40 border border-emerald-500/30 rounded-full px-2 py-0.5 text-xs text-emerald-200">
                    <span>@ {mention.user?.name}</span>
                    <button 
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmRemoveMentionId(mention.id);
                      }} 
                      className="hover:text-red-400 transition-colors p-0.5 rounded-full hover:bg-red-400/10 ml-1 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 🟡 Three-dot menu */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleMenuToggle}
                className="text-yellow-300/70 hover:text-yellow-200 p-1 rounded hover:bg-yellow-300/10"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Dropdown menu */}
            {menuOpen &&
              createPortal(
                <div
                  ref={menuRef}
                  onMouseLeave={() => setMenuOpen(false)}
                  className="fixed z-[9999] w-48 bg-gradient-to-br from-[#0f1d17]/95 to-[#1a3229]/90 border border-yellow-300/20 rounded-xl shadow-[0_0_20px_rgba(255,255,120,0.25)] backdrop-blur-xl overflow-hidden"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <button
                    onClick={() => {
                      setEditModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-lime-300 hover:bg-yellow-200/10 transition-colors"
                  >
                    <Pencil size={14} /> Edit Task
                  </button>
                  
                  {/* Mentions Modal Trigger */}
                  <button
                    onClick={() => {
                        setMentionsModal(true);
                        setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Users size={14} /> Mentions
                  </button>

                  {/* Priority Modal Trigger */}
                  <button
                    onClick={() => {
                        setPriorityModal(true);
                        setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/10 transition-colors"
                  >
                    <Check size={14} /> Priority
                  </button>

                  {/* Due Date Modal Trigger */}
                  <button
                    onClick={() => {
                        setDueDateModal(true);
                        setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/10 transition-colors"
                  >
                    <Calendar size={14} /> Due Date
                  </button>

                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Task
                  </button>
                </div>,
                document.body
              )}
          </PortalAwareItem>
        )}
      </Draggable>

      {/* ✏️ Edit Modal */}
      {editModal &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-yellow-300/20 rounded-2xl p-6 w-96 shadow-[0_0_40px_rgba(255,255,120,0.3)]">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent mb-4">
                Edit Task
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task Title"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d201a]/80 text-white border border-yellow-300/20 focus:border-yellow-400 outline-none"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task Description"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d201a]/80 text-white border border-yellow-300/20 focus:border-yellow-400 outline-none resize-none"
                  rows="3"
                />
                


                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-yellow-300 to-lime-300 text-gray-900 font-semibold hover:shadow-[0_0_20px_rgba(255,255,120,0.4)] transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      {/* 👥 Mentions Modal */}
      {mentionsModal &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-emerald-400/20 rounded-2xl p-6 w-80 shadow-[0_0_40px_rgba(120,255,150,0.3)]">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-300 via-lime-300 to-yellow-300 bg-clip-text text-transparent mb-6 text-center">
                Mention Member
              </h2>
              
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                {boardMembers.length > 0 ? (
                    boardMembers.map(member => {
                        const isMentioned = mentions.some(m => m.userId === member.user.id);
                        if (isMentioned) return null;
                        return (
                            <button
                                key={member.user.id}
                                onClick={() => handleAddMention(member.user.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-100 bg-emerald-900/20 hover:bg-emerald-800/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-200">
                                    {member.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{member.user.name}</span>
                            </button>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 py-4">No members found</div>
                )}
                {boardMembers.every(m => mentions.some(mentioned => mentioned.userId === m.user.id)) && boardMembers.length > 0 && (
                     <div className="text-center text-emerald-200/50 py-4 text-sm">All members mentioned</div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setMentionsModal(false)}
                  className="px-6 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 📅 Due Date Modal */}
      {dueDateModal &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-blue-400/20 rounded-2xl p-6 w-80 shadow-[0_0_40px_rgba(100,150,255,0.2)]">
              <h2 className="text-xl font-semibold text-blue-300 mb-4 text-center">
                Set Due Date
              </h2>
              
              <input 
                type="date" 
                value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ""}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#0d201a] text-white border border-blue-500/30 focus:border-blue-400 outline-none mb-6"
              />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDueDateModal(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDueDateUpdate(dueDate)}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition border border-blue-500/30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 🌟 Priority Modal */}
      {priorityModal &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-yellow-300/20 rounded-2xl p-6 w-80 shadow-[0_0_40px_rgba(255,255,120,0.3)]">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent mb-6 text-center">
                Set Priority
              </h2>
              
              <div className="flex flex-col gap-3">
                {["LOW", "MEDIUM", "HIGH"].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePriorityUpdate(p)}
                    className={`w-full py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-between px-4 ${
                      priority === p
                        ? getPriorityColor(p) + " shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-[1.02]"
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-white/5"
                    }`}
                  >
                    {p}
                    {priority === p && <Check size={16} />}
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setPriorityModal(false)}
                  className="px-6 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 🗑️ Remove Mention Confirmation Modal */}
      {confirmRemoveMentionId &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#091611]/95 to-[#112920]/90 border border-red-400/20 rounded-2xl p-6 w-80 shadow-[0_0_40px_rgba(255,100,100,0.2)]">
              <h2 className="text-xl font-semibold text-red-400 mb-4 text-center">
                Remove Mention?
              </h2>
              <p className="text-sm text-gray-300 text-center mb-6">
                Are you sure you want to remove this mention?
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setConfirmRemoveMentionId(null)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleRemoveMention(confirmRemoveMentionId);
                    setConfirmRemoveMentionId(null);
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition border border-red-500/30"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskCard;
