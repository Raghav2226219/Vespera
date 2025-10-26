import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm">
      <h3 className="font-medium">{task.title}</h3>
      {task.assignedUser && (
        <p className="text-sm text-gray-500">
          Assigned to: {task.assignedUser.name}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
