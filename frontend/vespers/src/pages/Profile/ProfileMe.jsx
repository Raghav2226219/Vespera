// src/pages/Profile/ProfileMe.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { Edit3, Phone, Calendar, MapPin, User, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileMe = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center text-emerald-400 text-lg font-medium">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-4 opacity-80">No profile found.</p>
        <a
          href="/profile/create"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-gray-900 font-semibold hover:bg-emerald-400 hover:scale-105 transition-all shadow-md"
        >
          Create Profile
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B1111] via-[#071C1B] to-[#0B2C29] flex flex-col items-center text-white">
      {/* Header Banner */}
      <div className="relative w-full h-48 sm:h-56 bg-gradient-to-r from-emerald-600/90 via-emerald-500/80 to-teal-400/80 rounded-b-[2rem] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_70%)]"
        />
      </div>

      {/* Floating Profile Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="-mt-20 w-[90%] max-w-3xl bg-[#0C1414]/90 backdrop-blur-md border border-emerald-400/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-8 sm:p-10 relative"
      >
        {/* Edit button */}
        <a
          href="/profile/edit"
          className="absolute top-5 right-5 bg-emerald-400/10 border border-emerald-400/30 p-2 rounded-full hover:bg-emerald-400/20 hover:scale-105 transition-all"
        >
          <Edit3 size={18} className="text-emerald-300" />
        </a>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <motion.img
            src={
              profile.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            }
            alt="Profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-32 h-32 rounded-2xl object-cover border-2 border-emerald-400/30 shadow-[0_0_25px_rgba(52,211,153,0.25)]"
          />

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              {profile.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
            <p className="text-emerald-100/70 text-sm italic mt-2">
              {profile.bio || "No bio added yet."}
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent my-8" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ProfileField
            icon={<Phone size={16} />}
            label="Phone"
            value={profile.phoneNumber || "Not added"}
          />
          <ProfileField
            icon={<Calendar size={16} />}
            label="Date of Birth"
            value={
              profile.dob
                ? new Date(profile.dob).toLocaleDateString()
                : "Not set"
            }
          />
          <ProfileField
            icon={<User size={16} />}
            label="Gender"
            value={profile.gender || "Not specified"}
          />
          <ProfileField
            icon={<MapPin size={16} />}
            label="Address"
            value={profile.address || "Not provided"}
          />
        </div>
      </motion.div>

      {/* Back to Dashboard Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mt-10 flex items-center gap-2 px-6 py-2.5 bg-emerald-500/90 text-gray-900 font-semibold rounded-xl hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all"
      >
        <LayoutDashboard size={18} />
        Back to Dashboard
      </motion.button>
    </div>
  );
};

// Reusable info field
const ProfileField = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02, borderColor: "rgba(52,211,153,0.4)" }}
    transition={{ type: "spring", stiffness: 200 }}
    className="flex flex-col gap-1 bg-[#101B1A]/70 border border-emerald-400/10 rounded-2xl p-4 hover:border-emerald-400/30 transition-all"
  >
    <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-white/90 font-medium text-sm tracking-wide">
      {value}
    </span>
  </motion.div>
);

export default ProfileMe;
