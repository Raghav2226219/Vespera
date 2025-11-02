import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const InviteHeader = () => {
  const navigate = useNavigate();

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
                 w-full max-w-7xl mx-auto mt-8 px-6 py-4
                 backdrop-blur-lg bg-white/5 border border-white/10 
                 rounded-2xl shadow-xl"
    >
      {/* Left Side: Title */}
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-white">
          Invite Members
        </h1>
        <p className="text-emerald-200/80 mt-1 text-sm">
          Send invitations to collaborate on this board
        </p>
      </div>

      {/* Right Side: Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md 
                   bg-gradient-to-r from-gray-800 to-emerald-700
                   hover:from-gray-700 hover:to-emerald-600 
                   text-emerald-200 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>
    </header>
  );
};

export default InviteHeader;
