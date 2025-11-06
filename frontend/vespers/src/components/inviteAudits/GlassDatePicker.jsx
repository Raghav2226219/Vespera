// src/components/inviteAudits/GlassDatePicker.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";

const GlassDatePicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("days"); // "days" | "months" | "years"
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [position, setPosition] = useState({ top: 0, left: 0, direction: "down" });

  const buttonRef = useRef(null);
  const calendarRef = useRef(null);

  /* ---------- Click outside handler ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        calendarRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- Calculate position on open ---------- */
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarHeight = 310; // Approx. px
      const calendarWidth = 256;

      const spaceBelow = window.innerHeight - rect.bottom;
      const direction = spaceBelow < calendarHeight ? "up" : "down";

      const spaceRight = window.innerWidth - rect.left;
      const adjustedLeft =
        spaceRight < calendarWidth ? window.innerWidth - calendarWidth - 12 : rect.left;

      setPosition({
        top:
          direction === "down"
            ? rect.bottom + window.scrollY + 6
            : rect.top + window.scrollY - calendarHeight - 6,
        left: adjustedLeft + window.scrollX,
        direction,
      });
    }
  }, [open]);

  /* ---------- Calendar Logic ---------- */
  const handleSelect = (date) => {
    setSelectedDate(date);
    onChange({ target: { value: date.toISOString().split("T")[0] } });
    setOpen(false);
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
    if (view === "days") setView("years");
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setView("months");
  };

  const handleMonthSelect = (month) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setView("days");
  };

  const [yearOffset, setYearOffset] = useState(0);
  const baseYear = currentMonth.getFullYear() + yearOffset;
  const years = Array.from({ length: 25 }, (_, i) => baseYear - 12 + i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = monthStart.getDay();
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= monthEnd.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return (
    <div className="relative flex flex-col justify-end h-full">
      <label className="text-xs text-emerald-200/70 mb-1 block leading-none">{label}</label>

      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-[10px] rounded-xl
                   bg-[#11221c] border border-emerald-400/20 
                   text-emerald-100 font-medium
                   hover:bg-[#153029] transition-all duration-200
                   h-[42px] leading-none"
      >
        <span className="truncate">
          {selectedDate ? selectedDate.toLocaleDateString("en-IN") : "dd-mm-yyyy"}
        </span>
        <CalendarDays className="w-4 h-4 ml-2 text-emerald-300 flex-shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, y: position.direction === "down" ? -6 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position.direction === "down" ? -6 : 6 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: position.direction === "down" ? "calc(100% + 6px)" : "auto",
              bottom: position.direction === "up" ? "calc(100% + 6px)" : "auto",
              left: 0,
              zIndex: 9999,
            }}
            className="w-64 p-4 rounded-2xl bg-gradient-to-b from-[#0E1F1A] to-[#133227]
                       border border-[#1E3A34] shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <div
              onClick={handleToggleView}
              className="flex items-center justify-between mb-3 text-sm text-emerald-200 font-semibold cursor-pointer select-none"
            >
              <button onClick={handlePrevMonth} className="hover:text-emerald-400 px-1">
                ‹
              </button>
              <span>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="hover:text-emerald-400 px-1">
                ›
              </button>
            </div>

            {/* Year View */}
            {view === "years" && (
              <div>
                <div className="flex justify-between text-xs text-emerald-300 mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setYearOffset((prev) => prev - 25);
                    }}
                    className="hover:text-emerald-400"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setYearOffset((prev) => prev + 25);
                    }}
                    className="hover:text-emerald-400"
                  >
                    Next ▶
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-emerald-100 max-h-56 overflow-y-auto custom-scrollbar">
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`p-2 rounded-lg cursor-pointer transition text-sm ${
                        year === currentMonth.getFullYear()
                          ? "bg-emerald-600/70 text-white"
                          : "hover:bg-emerald-500/20 hover:text-emerald-300"
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
              <div className="grid grid-cols-3 gap-2 text-center text-emerald-100">
                {monthNames.map((m, i) => (
                  <div
                    key={m}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMonthSelect(i);
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition text-sm ${
                      i === currentMonth.getMonth()
                        ? "bg-emerald-600/70 text-white"
                        : "hover:bg-emerald-500/20 hover:text-emerald-300"
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
                <div className="grid grid-cols-7 text-center text-emerald-300/80 text-xs mb-2">
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
                            ? "bg-emerald-600/70 text-white"
                            : "text-emerald-100 hover:bg-emerald-500/20 hover:text-emerald-300"
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
    </div>
  );
};

export default GlassDatePicker;
