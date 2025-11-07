// src/pages/InviteAuditsAllPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";
import InviteAuditHeader from "../components/inviteAudits/InviteAuditHeader";
import InviteAuditCard from "../components/inviteAudits/InviteAuditCard";
import InviteAuditFilters from "../components/inviteAudits/InviteAuditFilters";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const InviteAuditsAllPage = () => {
  const [logs, setLogs] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [boardId, setBoardId] = useState("");
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [openBoardDropdown, setOpenBoardDropdown] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState(false);

  const boardRef = useRef(null);
  const actionRef = useRef(null);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Close dropdowns on outside click
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

  // Fetch all boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/board/all");
        const data = Array.isArray(res.data) ? res.data : res.data.boards || [];
        setBoards(data);
      } catch {
        console.error("Failed to load boards");
      }
    };
    fetchBoards();
  }, []);

  // Build query string for filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (boardId) params.set("boardId", boardId);
    if (action) params.set("action", action);
    if (search.trim()) params.set("search", search.trim());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return params.toString();
  }, [page, pageSize, boardId, action, search, dateFrom, dateTo]);

  // Fetch logs based on filters
  useEffect(() => {
    let cancelled = false;
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/invite-history/history?${queryString}`);
        if (!cancelled && res.data?.success) {
          setLogs(res.data.data || []);
          setTotalPages(res.data.totalPages || 1);
          setTotal(res.data.total || 0);
        } else if (!cancelled) {
          setError("Failed to fetch invite history.");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching invite history:", err);
          setError("Unable to fetch invite logs. Please try again later.");
        }
      } finally {
        if (!cancelled) setTimeout(() => setLoading(false), 400); // slight delay for smoother transition
      }
    };
    fetchLogs();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const resetAndRefetch = () => setPage(1);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] text-white p-6 md:p-10">
      {/* 🌌 Background holo aura */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,150,0.1),transparent_70%)] blur-3xl"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto h-full flex flex-col"
      >
        {/* Header */}
        <InviteAuditHeader />

        {/* Filters */}
        <InviteAuditFilters
          boards={boards}
          boardId={boardId}
          setBoardId={setBoardId}
          action={action}
          setAction={setAction}
          search={search}
          setSearch={setSearch}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          openBoardDropdown={openBoardDropdown}
          setOpenBoardDropdown={setOpenBoardDropdown}
          openActionDropdown={openActionDropdown}
          setOpenActionDropdown={setOpenActionDropdown}
          resetAndRefetch={resetAndRefetch}
        />

        {/* Logs List / Loading / Error */}
        <div className="flex-1 min-h-0 flex flex-col relative">
          {loading ? (
            // 🌟 Polished Loading Animation
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden no-scrollbar">
              {/* Holo Circle Animation */}
              <motion.div
                className="relative w-20 h-20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 border-t-yellow-300 blur-[1px]" />
                <div className="absolute inset-[6px] rounded-full border-2 border-yellow-300/20 border-t-yellow-200 animate-pulse" />
              </motion.div>

              {/* Holo Glow Pulse */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl"
              />

              {/* Text */}
              <motion.p
                className="mt-10 text-lg font-semibold text-yellow-200/90 tracking-wide"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                Loading invite logs…
              </motion.p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8 text-yellow-200 bg-yellow-900/10 rounded-lg max-w-md mx-auto px-6 border border-yellow-400/20 shadow-[0_0_20px_rgba(255,255,150,0.1)]">
                {error}
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-yellow-200/70 text-lg">
              No invite activities found.
            </div>
          ) : (
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <div className="absolute inset-0 border-l border-yellow-400/25 pl-6 space-y-6 custom-scrollbar overflow-y-auto overflow-x-hidden pr-4">
                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <InviteAuditCard key={log.id || idx} log={log} idx={idx} />
                  ))}
                </AnimatePresence>
                <div className="h-4" />
              </div>
            </div>
          )}

          {/* 🌠 Pagination Footer */}
          {!loading && !error && logs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-5"
            >
              <div className="flex items-center justify-between bg-gradient-to-br from-[#111e18]/90 via-[#163321]/80 to-[#1a3a29]/85 border border-yellow-400/20 rounded-xl px-5 py-3 shadow-[0_0_25px_rgba(255,255,150,0.1)] backdrop-blur-xl">
                <div className="text-yellow-200/80 text-sm font-medium">
                  Page <span className="text-yellow-300">{page}</span> of{" "}
                  <span className="text-yellow-300">{totalPages}</span> ·{" "}
                  <span className="text-yellow-300">{total}</span> results
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-400/20 text-yellow-100 font-medium transition-all ${
                      page <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-yellow-400/10 hover:shadow-[0_0_12px_rgba(255,255,150,0.2)]"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-400/20 text-yellow-100 font-medium transition-all ${
                      page >= totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-yellow-400/10 hover:shadow-[0_0_12px_rgba(255,255,150,0.2)]"
                    }`}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InviteAuditsAllPage;
