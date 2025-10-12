import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const floatAnim = {
  animate: { y: [0, -10, 0], rotate: [0, 1, -1, 0] },
  transition: {
    duration: 10,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    address: "",
    bio: "",
    profilePic: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/profile/create", form);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 overflow-hidden relative">
      {/* Background Lights */}
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 -top-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-20 bottom-8 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* Glass Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left Form Section */}
          <div className="w-full md:w-1/2 p-5 md:p-7 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-300 flex items-center justify-center border border-white/10">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/90"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-sm text-white/70 font-medium">Vespera</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-amber-200 to-white font-extrabold tracking-tight">
              Profile Information
            </h1>

            <p className="mt-1 text-xs text-emerald-200/70">
              Update your personal details below.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {error && (
                <div className="text-xs text-rose-200 bg-rose-700/30 px-2 py-1.5 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-xs text-emerald-200 bg-emerald-700/30 px-2 py-1.5 rounded-lg">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="text-xs text-white/60">Full Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="John Doe"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-white/60">Phone Number</span>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="+91 9876543210"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-white/60">Date of Birth</span>
                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-white/60">Gender</span>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5  border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 appearance-none cursor-pointer hover:bg-white/10"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male" className="text-black">Male</option>
                    <option value="Female" className="text-black">Female</option>
                    <option value="Other" className="text-black">Other</option>
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-white/60">Address</span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="123 Street, City"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-white/60">Bio</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="2"
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                    placeholder="Write something about yourself..."
                  ></textarea>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-white/60">Profile Picture URL</span>
                  <input
                    name="profilePic"
                    type="url"
                    value={form.profilePic}
                    onChange={handleChange}
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="https://example.com/avatar.png"
                  />
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 rounded-lg text-gray-900 font-semibold bg-[linear-gradient(120deg,#34d399,#06b6d4,#34d399)] bg-[length:200%_100%] animate-shimmer shadow-lg"
              >
                {loading ? "Saving..." : "Save Profile"}
              </motion.button>
            </form>
          </div>

          {/* Right Image Section */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]">
            <motion.div
              className="w-56 h-56 md:w-64 md:h-64 rounded-2xl flex items-center justify-center border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-400/10 shadow-lg"
              animate={floatAnim.animate}
              transition={floatAnim.transition}
            >
              <motion.img
                src={
                  form.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                }
                alt="Profile Preview"
                className="w-28 h-28 md:w-32 md:h-32 object-contain rounded-full drop-shadow-[0_10px_40px_rgba(6,95,70,0.18)]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
