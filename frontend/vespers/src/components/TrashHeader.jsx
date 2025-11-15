import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VesperaMiniHolo from "../components/VesperaMiniHolo";

const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
};

const TrashHeader = ({
  search,
  setSearch,
  sortOption,
  setSortOption,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const navigate = useNavigate();
  const closeTimeoutRef = useRef(null);

  const handleSort = (value) => {
    setSortOption(value);
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 
                 backdrop-blur-lg bg-gradient-to-br from-gray-950/80 via-emerald-950/60 to-emerald-900/50 
                 px-6 py-4 rounded-2xl border border-lime-400/20 
                 shadow-[0_0_25px_rgba(255,255,150,0.12)] relative z-[50]"
    >
      {/* 🌌 Left Brand + Title */}
      <div className="flex items-center gap-4">
        {/* Vespera Logo */}
        <div className="scale-90 sm:scale-100">
          <VesperaMiniHolo size={48} />
        </div>

        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 via-yellow-300 to-white drop-shadow-[0_0_18px_rgba(255,255,150,0.25)]">
            Trash
          </h1>
          <p className="text-lime-200/80 mt-1 text-sm">
            View and restore deleted boards
          </p>
        </div>
      </div>

      {/* ⚙️ Controls */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">

        {/* 🧭 Dashboard Button */}
        <motion.button
          onClick={handleDashboard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium 
                     bg-gradient-to-r from-emerald-700 via-lime-500/80 to-yellow-400/70
                     text-gray-900 shadow-[0_0_20px_rgba(190,255,150,0.3)]
                     hover:shadow-[0_0_30px_rgba(255,255,150,0.45)] transition-all duration-300"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </motion.button>

        {/* Sort Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = setTimeout(() => {
              setDropdownOpen(false);
              closeTimeoutRef.current = null;
            }, 180);
          }}
        >
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
                {[
                  { label: "Default", value: "default" },
                  { label: "A → Z", value: "az" },
                  { label: "Z → A", value: "za" },
                  { label: "Newest First", value: "newest" },
                  { label: "Oldest First", value: "oldest" },
                ].map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleSort(opt.value)}
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
            placeholder="Search trashed boards..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-lime-400/20
                       text-lime-100 placeholder-lime-200/40
                       backdrop-blur-md shadow-inner
                       focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50
                       transition duration-300"
          />
        </div>
      </div>
    </header>
  );
};

export default TrashHeader;
