import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VesperaMiniHolo from "../components/VesperaMiniHolo"; // ✅ adjust path if needed

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
                   backdrop-blur-lg bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-emerald-900/50 
                   px-6 py-5 rounded-2xl border border-lime-400/20 
                   shadow-[0_0_25px_rgba(255,255,150,0.12)] relative z-[50]"
      >
        {/* 🌌 Left Section: Holo + Title */}
        <div className="flex items-center gap-4">
          {/* 🔮 Hologram */}
          <div className="scale-90 sm:scale-100">
            <VesperaMiniHolo size={48} />
          </div>

          {/* 🌟 Title Section */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl font-extrabold bg-clip-text text-transparent 
                         bg-gradient-to-r from-lime-300 via-yellow-300 to-white 
                         drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lime-200/80 mt-1 text-sm"
            >
              {subtitle}
            </motion.p>

            {/* ⚡ Underline Beam */}
            <motion.div
              className="mt-2 w-32 h-[2px] rounded-full bg-gradient-to-r 
                         from-transparent via-yellow-300/70 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* ⚙️ Right Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
          {/* 🔙 Back Button */}
          <motion.button
            onClick={() => navigate("/boards")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl font-semibold shadow-md 
                       bg-gradient-to-r from-emerald-700 via-lime-500/80 to-yellow-400/70
                       text-gray-900 hover:shadow-[0_0_25px_rgba(255,255,150,0.45)]
                       transition-all duration-300"
          >
            ← Back to Boards
          </motion.button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center justify-between w-44 px-4 py-2.5 rounded-xl 
                         bg-gradient-to-r from-lime-900/60 to-yellow-900/30 border border-lime-400/20
                         text-lime-100 font-medium backdrop-blur-md shadow-inner shadow-lime-900/30
                         hover:shadow-[0_0_12px_rgba(255,255,150,0.3)] hover:from-lime-800/70 hover:to-yellow-800/50
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
                  className="absolute mt-2 w-44 bg-gradient-to-b from-lime-950/95 via-lime-900/90 to-yellow-950/90 
                             border border-lime-400/30 rounded-xl backdrop-blur-2xl shadow-xl 
                             shadow-yellow-900/40 overflow-hidden z-[9999]"
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
                                     ? "bg-gradient-to-r from-lime-500/20 to-yellow-500/20 text-lime-300"
                                     : "text-lime-100 hover:bg-white/10 hover:text-yellow-200"
                                 }`}
                    >
                      {opt.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 🔍 Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-300/70 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archived..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-lime-400/20
                         text-lime-100 placeholder-lime-200/40
                         backdrop-blur-md shadow-inner
                         focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50
                         transition duration-300"
            />
          </div>
        </div>
      </header>
    </motion.div>
  );
};

export default ArchiveHeader;
