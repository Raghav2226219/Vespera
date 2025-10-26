import React from "react";
import TaskCard from "./TaskCard";
import Loader from "./Loader"; // ✅ Keep for potential loading states

const Column = ({ column, loading }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-emerald-400/20 p-4 rounded-2xl shadow-lg min-w-[280px] transition-all duration-300 hover:shadow-emerald-400/20">
      {/* ✅ Optional Loader if column is refreshing */}
      {loading && <Loader />}

      {/* Column Title */}
      <h2 className="text-lg font-semibold text-emerald-300 mb-4">
        {column.name}
      </h2>

      {/* ✅ Task List */}
      {column.tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="text-emerald-200/60 italic text-sm">
          No tasks in this column.
        </p>
      )}
    </div>
  );
};

export default Column;
