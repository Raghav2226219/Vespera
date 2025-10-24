// src/pages/Profile/ProfileMe.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";

const ProfileMe = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p>No profile found.</p>
        <a
          href="/profile/create"
          className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-gray-900 font-semibold"
        >
          Create Profile
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-[90%] text-center shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
      >
        <img
          src={
            profile.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto border border-white/10 shadow-lg"
        />
        <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
        <p className="text-emerald-200/70">{profile.bio || "No bio provided"}</p>

        <div className="mt-4 text-sm text-white/70 space-y-1">
          <p>📞 {profile.phoneNumber}</p>
          <p>📅 {profile.dob || "N/A"}</p>
          <p>⚧ {profile.gender}</p>
          <p>🏠 {profile.address}</p>
        </div>

        <a
          href="/profile/edit"
          className="mt-6 inline-block px-4 py-2 bg-emerald-400 text-gray-900 rounded-lg font-semibold hover:bg-emerald-300 transition-all"
        >
          Edit Profile
        </a>
      </motion.div>
    </div>
  );
};

export default ProfileMe;
