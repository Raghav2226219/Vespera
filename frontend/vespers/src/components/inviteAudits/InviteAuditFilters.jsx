// src/components/inviteAudits/InviteAuditFilters.jsx
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassDatePicker from "./GlassDatePicker";

const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.1, ease: "easeIn" } },
};

const InviteAuditFilters = ({
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
  const ACTIONS = ["SENT", "ACCEPTED", "CANCELLED", "SUSPICIOUS", "PENDING"];

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
    <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-5 bg-[#0b1915] border border-white/10 rounded-2xl p-5 items-end">
      {/* Back Button */}
      <div className="flex items-end">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-5 py-[10px] rounded-xl
                     bg-[#11221c] border border-emerald-400/20 
                     text-emerald-100 font-medium hover:bg-[#153029]
                     hover:text-emerald-300 transition-all duration-200 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </button>
      </div>

      {/* Board Dropdown */}
      <div className="relative" ref={boardRef}>
        <label className="text-xs text-emerald-200/70 mb-1 block">Board</label>
        <button
          onClick={() => {
            setOpenBoardDropdown(!openBoardDropdown);
            setOpenActionDropdown(false);
          }}
          className="w-full flex items-center justify-between px-4 py-[10px] rounded-xl
                     bg-[#11221c] border border-emerald-400/20
                     text-emerald-100 font-medium hover:bg-[#153029]
                     transition-all duration-200 h-[42px]"
        >
          {boardId
            ? boards.find((b) => String(b.id) === String(boardId))?.title || "Select Board"
            : "All Boards"}
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
                         bg-[#0D1B17] border border-[#1E3A34]
                         shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-sm"
            >
              <li
                onClick={() => {
                  setBoardId("");
                  setOpenBoardDropdown(false);
                  resetAndRefetch();
                }}
                className="px-4 py-2 text-[#A7F3D0] cursor-pointer hover:bg-[#122720] hover:text-emerald-300 transition"
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
                  className={`px-4 py-2 cursor-pointer transition ${
                    boardId === String(b.id || b._id)
                      ? "bg-[#153029] text-emerald-300"
                      : "text-emerald-100 hover:bg-[#122720] hover:text-emerald-200"
                  }`}
                >
                  {b.title}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Action Dropdown */}
      <div className="relative" ref={actionRef}>
        <label className="text-xs text-emerald-200/70 mb-1 block">Action</label>
        <button
          onClick={() => {
            setOpenActionDropdown(!openActionDropdown);
            setOpenBoardDropdown(false);
          }}
          className="w-full flex items-center justify-between px-4 py-[10px] rounded-xl
                     bg-[#11221c] border border-emerald-400/20
                     text-emerald-100 font-medium hover:bg-[#153029]
                     transition-all duration-200 h-[42px]"
        >
          {action || "All"}
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
                         bg-[#0D1B17] border border-[#1E3A34]
                         shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-sm"
            >
              <li
                onClick={() => {
                  setAction("");
                  setOpenActionDropdown(false);
                  resetAndRefetch();
                }}
                className="px-4 py-2 text-[#A7F3D0] cursor-pointer hover:bg-[#122720] hover:text-emerald-300 transition"
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
                  className={`px-4 py-2 cursor-pointer transition ${
                    action === a
                      ? "bg-[#153029] text-emerald-300"
                      : "text-emerald-100 hover:bg-[#122720] hover:text-emerald-200"
                  }`}
                >
                  {a}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="md:col-span-2">
        <label className="text-xs text-emerald-200/70 mb-1 block">
          Search (email, name, board)
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={resetAndRefetch}
          placeholder="e.g., alice@mail.com, Bob, Marketing Board"
          className="w-full bg-[#11221c] border border-emerald-400/20 rounded-xl px-4 py-[10px]
                     text-emerald-100 placeholder-emerald-300/40
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition duration-200 h-[42px]"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
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

export default InviteAuditFilters;
