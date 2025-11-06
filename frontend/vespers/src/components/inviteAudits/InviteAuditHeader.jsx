// src/components/inviteAudits/InviteAuditHeader.jsx
import React from "react";

const InviteAuditHeader = () => {
  return (
    <div className="mb-4">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
        Invite Audits — All Boards
      </h1>
      <p className="text-emerald-200/80 mt-1 text-sm">
        View and filter invite activity across all boards.
      </p>
    </div>
  );
};

export default InviteAuditHeader;
