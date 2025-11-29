import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassDatePicker from "../inviteAudits/GlassDatePicker";

const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.1, ease: "easeIn" } },
};

const TaskAuditFilters = ({
  boards,
  boardId,
  setBoardId,
  action,
  setAction,
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  openBoardDropdown,
  setOpenBoardDropdown,
  openActionDropdown,
  setOpenActionDropdown,
  resetAndRefetch,
}) => {
  const boardRef = useRef(null);
  const actionRef = useRef(null);
  const navigate = useNavigate();
  const ACTIONS = ["created", "updated", "moved", "deleted"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (boardRef.current && !boardRef.current.contains(e.target)) &&
        (actionRef.current && !actionRef.current.contains(e.target))
      ) {
        setOpenBoardDropdown(false);
        setOpenActionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative z-10 grid grid-cols-1 md:grid-cols-6 gap-5 mb-5 
                 px-5 py-6 rounded-2xl border border-yellow-300/15 
                 bg-gradient-to-br from-[#0b1914]/90 via-[#143121]/85 to-[#1a3e28]/85
                 backdrop-blur-2xl shadow-[0_0_35px_rgba(255,255,150,0.12)] 
                 transition-all duration-300"
    >
      {/* 🌈 Background glow beam */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-yellow-300/10 via-lime-400/15 to-transparent blur-2xl"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🔙 Back Button */}
      <div className="flex items-end relative z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-5 py-[10px] rounded-xl
                     bg-gradient-to-r from-lime-700/40 via-yellow-600/40 to-emerald-700/40
                     border border-yellow-400/20
                     text-yellow-100 font-medium 
                     hover:from-lime-600/50 hover:to-yellow-500/50 
                     hover:text-yellow-200 
                     shadow-[0_0_15px_rgba(255,255,150,0.15)]
                     transition-all duration-300 w-full"
        >
          <ArrowLeft className="w-4 h-4 text-yellow-300" />
          <span className="hidden md:inline">Back</span>
        </button>
      </div>

      {/* 🧭 Board Dropdown */}
      <div className="relative z-10" ref={boardRef}>
        <label className="text-xs text-yellow-100/80 mb-1 block">Board</label>
        <button
          onClick={() => {
            setOpenBoardDropdown(!openBoardDropdown);
            setOpenActionDropdown(false);
          }}
          className="w-full flex items-center justify-between px-4 py-[10px] rounded-xl
                     bg-gradient-to-r from-lime-900/50 to-yellow-900/30 
                     border border-yellow-400/20 text-yellow-100 font-medium
                     backdrop-blur-md shadow-inner shadow-yellow-900/30
                     hover:shadow-[0_0_12px_rgba(255,255,150,0.3)] 
                     hover:from-lime-800/60 hover:to-yellow-800/40
                     transition-all duration-300 h-[42px]"
        >
          <span className="truncate">
            {boardId
              ? boards.find((b) => String(b.id) === String(boardId))?.title || "Select Board"
              : "All Boards"}
          </span>
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              openBoardDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {openBoardDropdown && (
            <motion.ul
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute z-50 mt-2 w-full py-2 rounded-xl
                         bg-gradient-to-b from-lime-950/95 via-lime-900/90 to-yellow-950/90 
                         border border-lime-400/30 backdrop-blur-2xl shadow-xl 
                         shadow-yellow-900/40 overflow-hidden text-sm max-h-60 overflow-y-auto custom-scrollbar"
            >
              <li
                onClick={() => {
                  setBoardId("");
                  setOpenBoardDropdown(false);
                  resetAndRefetch();
                }}
                className="px-4 py-2 text-yellow-200 cursor-pointer hover:bg-white/10 hover:text-yellow-300 transition"
              >
                All Boards
              </li>
              {boards.map((b) => (
                <li
                  key={b.id || b._id}
                  onClick={() => {
                    setBoardId(b.id || b._id);
                    setOpenBoardDropdown(false);
                    resetAndRefetch();
                  }}
                  className={`px-4 py-2 cursor-pointer transition truncate ${
                    boardId === String(b.id || b._id)
                      ? "bg-gradient-to-r from-lime-500/20 to-yellow-500/20 text-yellow-300"
                      : "text-lime-100 hover:bg-white/10 hover:text-yellow-200"
                  }`}
                >
                  {b.title}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ⚙️ Action Dropdown */}
      <div className="relative z-10" ref={actionRef}>
        <label className="text-xs text-yellow-100/80 mb-1 block">Action</label>
        <button
          onClick={() => {
            setOpenActionDropdown(!openActionDropdown);
            setOpenBoardDropdown(false);
          }}
          className="w-full flex items-center justify-between px-4 py-[10px] rounded-xl
                     bg-gradient-to-r from-lime-900/50 to-yellow-900/30 
                     border border-yellow-400/20 text-yellow-100 font-medium
                     backdrop-blur-md shadow-inner shadow-yellow-900/30
                     hover:shadow-[0_0_12px_rgba(255,255,150,0.3)] 
                     hover:from-lime-800/60 hover:to-yellow-800/40
                     transition-all duration-300 h-[42px]"
        >
          <span className="truncate capitalize">{action.replace(/_/g, " ") || "All"}</span>
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              openActionDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {openActionDropdown && (
            <motion.ul
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute z-50 mt-2 w-full py-2 rounded-xl
                         bg-gradient-to-b from-lime-950/95 via-lime-900/90 to-yellow-950/90 
                         border border-lime-400/30 backdrop-blur-2xl shadow-xl 
                         shadow-yellow-900/40 overflow-hidden text-sm"
            >
              <li
                onClick={() => {
                  setAction("");
                  setOpenActionDropdown(false);
                  resetAndRefetch();
                }}
                className="px-4 py-2 text-yellow-200 cursor-pointer hover:bg-white/10 hover:text-yellow-300 transition"
              >
                All
              </li>
              {ACTIONS.map((a) => (
                <li
                  key={a}
                  onClick={() => {
                    setAction(a);
                    setOpenActionDropdown(false);
                    resetAndRefetch();
                  }}
                  className={`px-4 py-2 cursor-pointer transition capitalize ${
                    action === a
                      ? "bg-gradient-to-r from-lime-500/20 to-yellow-500/20 text-yellow-300"
                      : "text-lime-100 hover:bg-white/10 hover:text-yellow-200"
                  }`}
                >
                  {a.replace(/_/g, " ")}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* 🔍 Search */}
      <div className="md:col-span-2 relative z-10">
        <label className="text-xs text-yellow-100/80 mb-1 block">
          Search (user, board, task, action)
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={resetAndRefetch}
          placeholder="e.g., Alice, Task Name, Created"
          className="w-full bg-white/10 border border-yellow-400/20 rounded-xl px-4 py-[10px]
                     text-yellow-100 placeholder-yellow-200/40
                     focus:outline-none focus:ring-2 focus:ring-yellow-400/40 
                     backdrop-blur-md transition duration-300 h-[42px]"
        />
      </div>

      {/* 📅 Date Range */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <GlassDatePicker
          label="From"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            resetAndRefetch();
          }}
        />
        <GlassDatePicker
          label="To"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            resetAndRefetch();
          }}
        />
      </div>
    </div>
  );
};

export default TaskAuditFilters;
