import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import TaskAuditHeader from "../components/taskAudits/TaskAuditHeader";
import TaskAuditFilters from "../components/taskAudits/TaskAuditFilters";
import TaskAuditCard from "../components/taskAudits/TaskAuditCard";

const TaskAuditsPage = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown states
  const [openBoardDropdown, setOpenBoardDropdown] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState(false);

  // Fetch Boards for Filter
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await API.get("/board");
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };
    fetchBoards();
  }, []);

  // Fetch Audits
  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        boardId: boardId || undefined,
        action: action || undefined,
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const res = await API.get("/task-audits/all", {
        params,
      });

      setAudits(res.data.audits);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching task audits:", err);
      setError("Failed to load task audits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [page, boardId, action, dateFrom, dateTo]); // Search triggers on blur/enter usually, but here we can trigger on change or debounced. 
  // For simplicity, let's trigger on search change with debounce or just let the user hit enter/blur?
  // In BoardAuditFilters, we used onBlur. Here let's stick to that pattern or add a refresh button.
  // Actually, let's add `search` to dependency array but maybe debounce it?
  // For now, I'll add `search` to dependency array but in the filter component I usually use onBlur or a button.
  // Let's rely on the `resetAndRefetch` passed to filters which calls `fetchAudits`.

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const resetAndRefetch = () => {
    setPage(1);
    fetchAudits();
  };

  return (
    <div className="min-h-screen bg-[#0b1410] text-yellow-50 font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <TaskAuditHeader />

        <TaskAuditFilters
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

        {/* 🌀 Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
            <p className="text-yellow-200/60 animate-pulse">Loading task history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>{error}</p>
            <button 
              onClick={fetchAudits}
              className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {audits.length === 0 ? (
              <div className="text-center py-20 text-yellow-200/40 italic border border-dashed border-yellow-400/10 rounded-2xl">
                No task audits found matching your criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {audits.map((audit, index) => (
                  <TaskAuditCard key={audit.id} audit={audit} index={index} />
                ))}
              </div>
            )}

            {/* 📄 Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-yellow-400/10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-yellow-400/5 border border-yellow-400/20 text-yellow-200 
                             disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-400/10 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="text-sm font-medium text-yellow-200/60">
                  Page <span className="text-yellow-300">{page}</span> of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-yellow-400/5 border border-yellow-400/20 text-yellow-200 
                             disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-400/10 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskAuditsPage;
