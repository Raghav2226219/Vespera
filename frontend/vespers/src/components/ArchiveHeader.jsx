import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
};

const ArchiveHeader = ({
  title = "Archived Boards",
  subtitle = "View and manage your archived boards",
  sortOption,
  setSortOption,
  search,
  setSearch,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto relative"
    >
      <header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10
                   backdrop-blur-lg bg-white/5 px-6 py-4 rounded-2xl border border-white/10
                   shadow-xl w-full"
      >
        {/* Title + Subtitle */}
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
            {title}
          </h1>
          <p className="text-emerald-200/80 mt-1 text-sm">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
          {/* Back Button */}
          <button
            onClick={() => navigate("/boards")}
            className="px-4 py-2 rounded-xl font-medium shadow-md 
            bg-gradient-to-r from-gray-800 to-emerald-700
            hover:from-gray-700 hover:to-emerald-600 
            text-emerald-200 transition-all duration-300 hover:scale-105"
          >
            ← Back to Boards
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center justify-between w-44 px-4 py-2.5 rounded-xl 
                         bg-gradient-to-r from-emerald-900/60 to-cyan-900/40 border border-emerald-400/20
                         text-emerald-100 font-medium backdrop-blur-md shadow-inner shadow-emerald-900/30
                         hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:from-emerald-800/70 hover:to-cyan-800/50
                         transition-all duration-300"
            >
              {sortOption === "default"
                ? "Sort: Default"
                : sortOption === "az"
                ? "Sort: A → Z"
                : sortOption === "za"
                ? "Sort: Z → A"
                : sortOption === "newest"
                ? "Newest First"
                : "Oldest First"}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute mt-2 w-44 bg-gradient-to-b from-emerald-950/95 via-emerald-900/90 to-cyan-950/90 
                             border border-emerald-400/30 rounded-xl backdrop-blur-2xl shadow-xl 
                             shadow-emerald-900/40 overflow-hidden z-[9999]"
                >
                  {sortOptions.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => {
                        setSortOption(opt.value);
                        setDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition 
                                 ${
                                   sortOption === opt.value
                                     ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300"
                                     : "text-emerald-100 hover:bg-white/10 hover:text-emerald-200"
                                 }`}
                    >
                      {opt.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/60 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archived..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-emerald-400/20
                         text-emerald-100 placeholder-emerald-300/40
                         backdrop-blur-md shadow-inner
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50
                         transition duration-300"
            />
          </div>
        </div>
      </header>
    </motion.div>
  );
};

export default ArchiveHeader;
