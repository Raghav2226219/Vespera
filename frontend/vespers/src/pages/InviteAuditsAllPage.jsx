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
        if (!cancelled) setLoading(false);
      }
    };
    fetchLogs();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const resetAndRefetch = () => setPage(1);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white p-6 md:p-10">
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

        {/* Logs List */}
        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-emerald-200/80 text-lg">
              Loading invite history…
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8 text-rose-300 bg-rose-900/20 rounded-lg max-w-md mx-auto px-6">
                {error}
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-emerald-200/70 text-lg">
              No invite activities found.
            </div>
          ) : (
            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-0 border-l border-emerald-600/30 pl-6 space-y-6 custom-scrollbar overflow-y-auto pr-4">
                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <InviteAuditCard key={log.id || idx} log={log} idx={idx} />
                  ))}
                </AnimatePresence>
                <div className="h-4" />
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="text-emerald-200/80 text-sm">
                Page {page} of {totalPages} · {total} results
              </div>
              <div className="flex gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition ${
                    page <= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition ${
                    page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InviteAuditsAllPage;
