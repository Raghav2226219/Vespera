import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import api from "../../api/axios";
import {
  Edit3,
  Phone,
  Calendar,
  MapPin,
  User,
  LayoutDashboard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import VesperaHologram from "../../components/VesperaHologram";

/* ---------------------- small helpers ---------------------- */
const float = (d = 6, y = 10, x = 6) => ({
  animate: { y: [0, -y, 0], x: [0, x, 0] },
  transition: { duration: d, repeat: Infinity, ease: "easeInOut" },
});

const Chip = ({ label, delay = 0, style }) => (
  <motion.div
    style={style}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className="pointer-events-none absolute z-[8]"
  >
    <motion.div
      {...float(5 + (delay % 3), 6, 4)}
      className="rounded-xl border border-lime-400/30 bg-[rgba(10,30,26,0.55)]
                 px-3 py-1 text-[11px] tracking-wide text-lime-200
                 shadow-[0_0_18px_rgba(190,255,150,0.25)] backdrop-blur-md"
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,150,0.1), 0 0 20px rgba(190,255,150,0.2)",
      }}
    >
      {label}
    </motion.div>
  </motion.div>
);

/* Rebalanced chip layout */
const CHIP_LAYOUT = [
  { top: "8%", left: "6%", label: "Tasks" },
  { top: "10%", left: "20%", label: "Boards" },
  { top: "9%", left: "80%", label: "Quantum" },
  { top: "12%", left: "92%", label: "Logs" },
  { top: "20%", left: "8%", label: "Pulse" },
  { top: "22%", left: "90%", label: "Neural Net" },
  { top: "35%", left: "6%", label: "Vault" },
  { top: "38%", left: "90%", label: "Sync Node" },
  { top: "55%", left: "8%", label: "AI Bridge" },
  { top: "58%", left: "88%", label: "Telemetry" },
  { top: "70%", left: "14%", label: "Archive" },
  { top: "72%", left: "80%", label: "Network" },
  { top: "84%", left: "50%", label: "Projects" },
  { top: "88%", left: "32%", label: "Flow" },
  { top: "88%", left: "68%", label: "Nexus Beam" },
];

/* -------------------------------------------------------
   ⭐ OTP Modal Component
-------------------------------------------------------- */
function OtpModal({ open, onClose, onVerify }) {
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const verifyHandler = async () => {
    try {
      setSending(true);
      setError("");
      await onVerify(otp);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[90%] max-w-sm rounded-2xl bg-[#0f1f1a] border border-lime-400/30 p-6 shadow-[0_0_40px_rgba(190,255,150,0.25)]"
      >
        <h2 className="text-xl font-bold text-lime-200">Verify Email</h2>
        <p className="mt-1 text-sm text-lime-300/70">
          Enter the 6-digit OTP sent to your email.
        </p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mt-4 px-3 py-2 rounded-xl bg-[#11221c] border border-lime-400/25 text-lime-200 outline-none"
          placeholder="Enter OTP"
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-lime-200"
          >
            Cancel
          </button>
          <button
            disabled={sending}
            onClick={verifyHandler}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 text-gray-900 font-semibold disabled:opacity-60"
          >
            {sending ? "Verifying..." : "Verify"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------- */

export default function ProfileMe() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  const [bioModalOpen, setBioModalOpen] = useState(false);   // ⭐ NEW

  const navigate = useNavigate();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [8, -8]);
  const rotateY = useTransform(mx, [0, 1], [-8, 8]);

  /* Helper: Trim bio to 15 words */
  const getTrimmedBio = (bio) => {
    if (!bio) return "";
    const words = bio.trim().split(/\s+/);
    if (words.length <= 15) return bio;
    return words.slice(0, 15).join(" ") + " ...";
  };

  /* FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-lg mb-6 opacity-80">No profile found yet.</p>
          <a
            href="/profile/create"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 text-gray-900 font-semibold hover:scale-105 transition-all shadow-[0_0_25px_rgba(190,255,150,0.4)]"
          >
            Create Profile
          </a>
        </motion.div>
      </div>
    );
  }

  const isVerified = profile.user?.emailVerified;
  const email = profile.user?.email;
  const role = profile.user?.role;

  /* SEND OTP */
  const sendOtp = async () => {
    try {
      setOtpSending(true);
      await api.post("/email/send");
      setOtpModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  /* VERIFY OTP */
  const verifyOtp = async (otp) => {
    await api.post("/email/verify", { otp });
    setOtpModalOpen(false);

    const { data } = await api.get("/profile/me");
    setProfile(data);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white flex flex-col justify-center items-center">

      <OtpModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={verifyOtp}
      />

      {/* ⭐ BIO MODAL */}
{bioModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-[90%] max-w-lg rounded-2xl bg-[#0f1f1a] border border-lime-400/30 p-6 shadow-[0_0_40px_rgba(190,255,150,0.25)] text-lime-200"
    >
      <h2 className="text-xl font-bold mb-4 text-lime-100">Full Bio</h2>

      {/* Bio text with custom scrollbar */}
      <div
        className="vespera-scroll max-h-[300px] overflow-y-auto pr-2 text-sm leading-relaxed text-lime-200/90"
      >
        {profile.bio}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setBioModalOpen(false)}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 text-gray-900 font-semibold hover:scale-105 transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  </div>
)}


      {/* Ambient Glows */}
      <motion.div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-lime-400/15 blur-3xl" {...float(10, 14, 8)} />
      <motion.div className="absolute -bottom-28 -right-24 w-[34rem] h-[34rem] rounded-full bg-yellow-400/10 blur-3xl" {...float(12, 12, 10)} />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent tracking-tight"
        >
          Nexus Identity
        </motion.h1>

        <div className="absolute bottom-8 w-[68%] max-w-[880px] h-[2px] bg-gradient-to-r from-transparent via-lime-400/40 to-transparent rounded-full overflow-hidden">
          <motion.div
            className="h-full w-[18%] bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
            animate={{ x: ["-10%", "95%"] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Floating Chips */}
      {CHIP_LAYOUT.map((c, i) => (
        <Chip key={i} label={c.label} delay={i * 0.05} style={{ top: c.top, left: c.left }} />
      ))}

      {/* Main Section */}
      <div className="w-[90%] max-w-6xl mt-2 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* Hologram */}
        <div className="flex items-center justify-center">
          <VesperaHologram />
        </div>

        {/* Info Section */}
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - rect.left) / rect.width);
            my.set((e.clientY - rect.top) / rect.height);
          }}
          onMouseLeave={() => {
            mx.set(0.5);
            my.set(0.5);
          }}
          className="relative rounded-3xl border border-lime-400/25 bg-[rgba(10,26,22,0.55)]
                     backdrop-blur-2xl shadow-[0_0_60px_rgba(190,255,150,0.18)] px-8 py-8"
        >
          <motion.button
            whileHover={{ scale: 1.06, rotate: 6 }}
            className="absolute top-4 right-4 bg-lime-400/10 border border-lime-400/30 p-2 rounded-full hover:bg-yellow-400/10 transition-all"
            onClick={() => navigate("/profile/edit")}
          >
            <Edit3 size={18} className="text-lime-300" />
          </motion.button>

          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
            {profile.name}
          </h2>

          {/* Email */}
          <p className="text-lime-200/80 mt-1">{email}</p>

          {/* VERIFIED / NOT VERIFIED */}
          <div className="mt-2 flex items-center gap-2">
            {isVerified ? (
              <div className="flex items-center gap-1 text-emerald-300 text-sm">
                <CheckCircle size={16} />
                Verified
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-300 text-sm">
                <AlertCircle size={16} />
                Not Verified
              </div>
            )}
          </div>

          {!isVerified && (
            <button
              disabled={otpSending}
              onClick={sendOtp}
              className="mt-2 rounded-xl px-3 py-1.5 text-sm bg-lime-400/20 border border-lime-400/40 hover:bg-lime-400/30 transition disabled:opacity-50"
            >
              {otpSending ? "Sending OTP..." : "Verify Email"}
            </button>
          )}

          {/* Role */}
          <p className="text-yellow-200/80 text-sm mt-1">{role || "User"}</p>

          {/* ⭐ Bio with trim & modal trigger */}
          <p className="mt-3 text-sm text-lime-100/80 italic">
            {profile.bio ? (
              <>
                {getTrimmedBio(profile.bio)}
                {" "}
                {profile.bio.trim().split(/\s+/).length > 15 && (
                  <button
                    onClick={() => setBioModalOpen(true)}
                    className="text-lime-300 underline hover:text-yellow-300"
                  >
                    Read more
                  </button>
                )}
              </>
            ) : (
              "No bio added yet — tell us your story."
            )}
          </p>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-lime-400/40 to-transparent" />

          {/* Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={<Phone size={16} />} label="Phone" value={profile.phoneNumber || "Not added"} />
            <InfoCard icon={<Calendar size={16} />} label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"} />
            <InfoCard icon={<User size={16} />} label="Gender" value={profile.gender || "Not specified"} />
            <InfoCard icon={<MapPin size={16} />} label="Address" value={profile.address || "Not provided"} />
          </div>
        </motion.div>
      </div>

      {/* Footer Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="mt-6 z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl
                   bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 text-gray-900 font-semibold
                   shadow-[0_0_30px_rgba(190,255,150,0.35)] hover:shadow-[0_0_40px_rgba(255,255,150,0.45)] transition-all"
      >
        <LayoutDashboard size={18} />
        Back to Dashboard
      </motion.button>
    </div>
  );
}

/* ---- Reusable InfoCard ---- */
function InfoCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 12 }}
      className="relative overflow-hidden rounded-2xl border border-lime-400/25
                 bg-[linear-gradient(135deg,rgba(8,20,18,0.7),rgba(4,10,9,0.6))]
                 backdrop-blur-2xl p-4 sm:p-5 group transition-all duration-300"
    >
      <div className="flex items-center gap-2 text-lime-300 text-sm font-medium mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-yellow-100 font-semibold text-sm tracking-wide">{value}</p>
    </motion.div>
  );
}
