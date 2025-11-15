// src/pages/Profile/ProfileCheck.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

const ProfileCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Prevent multiple redirects caused by React strict mode
  const redirected = useRef(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (redirected.current) return;

      try {
        const res = await api.get("/profile/me");

        redirected.current = true;

        if (res.data) navigate("/profile/me");
        else navigate("/profile/create");
      } catch (err) {
        redirected.current = true;

        if (err.response?.status === 404) {
          navigate("/profile/create");
        } else {
          console.error(err);
          navigate("/profile/create");
        }
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden
                    bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white">

      {/* 🌿 Ambient Background Lights */}
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[20rem] h-[20rem] bg-emerald-400/10 blur-[100px] rounded-full"
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[22rem] h-[22rem] bg-yellow-400/10 blur-[120px] rounded-full"
      />

      {/* ✨ Holo Grid Overlay */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]
                      [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* 🌌 Scanning Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
          {/* Scanning Circle */}
          <motion.div
            className="relative w-24 h-24 rounded-full border-[3px] border-lime-400/40 shadow-[0_0_30px_rgba(190,255,150,0.25)]"
            animate={{
              rotate: 360,
              boxShadow: [
                "0 0 20px rgba(190,255,150,0.15)",
                "0 0 40px rgba(255,255,150,0.25)",
                "0 0 20px rgba(190,255,150,0.15)",
              ],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          >
            {/* Inner Pulse */}
            <motion.div
              className="absolute inset-[6px] rounded-full bg-gradient-to-r from-lime-400/20 via-yellow-300/10 to-transparent"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Text */}
          <motion.p
            className="text-lg sm:text-xl text-lime-200/80 tracking-wide font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Checking your profile…
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default ProfileCheck;
