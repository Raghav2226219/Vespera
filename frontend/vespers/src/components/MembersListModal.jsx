import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Shield, Mail } from "lucide-react";

const MembersListModal = ({ isOpen, onClose, members }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-[#0b1914] via-[#132d1f] to-[#193a29] 
                       border border-yellow-400/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] 
                       overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300">
                Board Members
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Members List */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              {members && members.length > 0 ? (
                members.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 
                               hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-300"
                  >
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 
                                    flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lime-100">
                          {member.user.name}
                        </h3>
                        {member.role === "Owner" && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider 
                                           bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {member.user.email}
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-200">
                        {member.role}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No members found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20 text-center text-xs text-gray-500">
              Total Members: {members?.length || 0}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MembersListModal;
