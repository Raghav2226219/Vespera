import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";

const GlassDatePicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("days");
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [yearOffset, setYearOffset] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, direction: "down" });

  const buttonRef = useRef(null);
  const calendarRef = useRef(null);
  const closeTimeout = useRef(null);

  /* ---------- Positioning Logic ---------- */
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const calendarHeight = 320;
    const calendarWidth = 256;

    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlipUp = spaceBelow < calendarHeight + 20;

    const spaceRight = window.innerWidth - rect.left;
    let leftPos = rect.left;
    if (spaceRight < calendarWidth) {
      leftPos = Math.max(12, window.innerWidth - calendarWidth - 12);
    }

    setCoords({
      top: shouldFlipUp ? rect.top - calendarHeight - 8 : rect.bottom + 8,
      left: leftPos,
      direction: shouldFlipUp ? "up" : "down",
    });
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      const handleUpdate = () => updatePosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [open]);

  /* ---------- Close on Outside Click ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        calendarRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
      setView("days");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- Hover-based Close Logic ---------- */
  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    // Wait a short moment before closing, so user can move between icon & calendar smoothly
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      setView("days");
    }, 300);
  };

  /* ---------- Toggle ---------- */
  const toggleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open) updatePosition();
    setOpen((prev) => !prev);
    setView("days");
  };

  /* ---------- Date Logic ---------- */
const handleSelect = (date) => {
  setSelectedDate(date);

  // ✅ Local date format (no timezone shift)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  onChange?.({ target: { value: `${year}-${month}-${day}` } });

  setOpen(false);
  setView("days");
};

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleToggleView = (e) => {
    e.stopPropagation();
    setView((v) => (v === "days" ? "years" : v));
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setView("months");
  };

  const handleMonthSelect = (month) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setView("days");
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = monthStart.getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= monthEnd.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const baseYear = currentMonth.getFullYear() + yearOffset;
  const years = Array.from({ length: 25 }, (_, i) => baseYear - 12 + i);

  /* ---------- Calendar UI ---------- */
  const calendarUI = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={calendarRef}
          initial={{ opacity: 0, y: coords.direction === "up" ? 8 : -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: coords.direction === "up" ? 8 : -8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: "256px",
            zIndex: 60,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="p-4 rounded-2xl bg-gradient-to-b from-[#0F231D] via-[#152E27] to-[#183728]
                     border border-lime-400/25 shadow-[0_0_25px_rgba(255,255,150,0.25)]
                     backdrop-blur-xl text-sm"
        >
          {/* Header */}
          <div
            onClick={handleToggleView}
            className="flex items-center justify-between mb-3 text-sm font-semibold text-lime-200 cursor-pointer select-none"
          >
            <button onClick={handlePrevMonth} className="hover:text-yellow-300 px-1 transition-colors">
              ‹
            </button>
            <span className="bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="hover:text-yellow-300 px-1 transition-colors">
              ›
            </button>
          </div>

          {/* Year View */}
          {view === "years" && (
            <div>
              <div className="flex justify-between text-xs text-lime-300 mb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setYearOffset((p) => p - 25);
                  }}
                  className="hover:text-yellow-300 transition-colors"
                >
                  ◀ Prev
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setYearOffset((p) => p + 25);
                  }}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Next ▶
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-lime-100 max-h-56 overflow-y-auto custom-scrollbar">
                {years.map((year) => (
                  <div
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`p-2 rounded-lg cursor-pointer transition text-sm ${
                      year === currentMonth.getFullYear()
                        ? "bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 text-gray-900 font-semibold"
                        : "hover:bg-lime-400/10 hover:text-yellow-200"
                    }`}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Month View */}
          {view === "months" && (
            <div className="grid grid-cols-3 gap-2 text-center text-lime-100">
              {monthNames.map((m, i) => (
                <div
                  key={m}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMonthSelect(i);
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition text-sm ${
                    i === currentMonth.getMonth()
                      ? "bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 text-gray-900 font-semibold"
                      : "hover:bg-lime-400/10 hover:text-yellow-200"
                  }`}
                >
                  {m.substring(0, 3)}
                </div>
              ))}
            </div>
          )}

          {/* Days View */}
          {view === "days" && (
            <>
              <div className="grid grid-cols-7 text-center text-lime-300/80 text-xs mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center gap-1">
                {days.map((d, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      d && handleSelect(d);
                    }}
                    className={`p-1.5 rounded-lg cursor-pointer text-sm transition 
                      ${
                        !d
                          ? ""
                          : selectedDate &&
                            d.toDateString() === selectedDate.toDateString()
                          ? "bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 text-gray-900 font-semibold"
                          : "text-lime-100 hover:bg-lime-400/10 hover:text-yellow-200"
                      }`}
                  >
                    {d ? d.getDate() : ""}
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className="relative flex flex-col justify-end h-full text-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label && (
        <label className="text-xs text-lime-200/80 mb-1 block leading-none">
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-3 py-[9px] rounded-xl
                   bg-[#11221c] border border-lime-400/25 
                   text-lime-100 font-medium text-sm
                   hover:bg-[#153029] hover:shadow-[0_0_10px_rgba(255,255,150,0.15)]
                   focus:ring-2 focus:ring-lime-400/40
                   transition-all duration-200 h-[42px] gap-2"
      >
        <span className="truncate">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-IN")
            : "dd-mm-yyyy"}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <CalendarDays className="w-[17px] h-[17px] text-yellow-300/80 flex-shrink-0" />
        </motion.div>
      </button>

      {createPortal(calendarUI, document.body)}
    </div>
  );
};

export default GlassDatePicker;
