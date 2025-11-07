import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Phone,
  MapPin,
  Quote,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";
import heroImg from "../../assets/vespera-hero.png";
import GlassDatePicker from "../../components/inviteAudits/GlassDatePicker";

/* Animations */
const orbFloat = {
  animate: { y: [0, -14, 0], x: [0, 6, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

const pulseBorder = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(190,255,150,0.0), 0 0 0px rgba(255,255,150,0.0)",
      "0 0 40px rgba(190,255,150,0.25), 0 0 60px rgba(255,255,150,0.15)",
      "0 0 0px rgba(190,255,150,0.0), 0 0 0px rgba(255,255,150,0.0)",
    ],
  },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    address: "",
    bio: "",
    profilePic: "",
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      await api.post("/profile/create", form, { withCredentials: true });
      setOk("Profile created successfully! 🌿");
      setTimeout(() => navigate("/profile/me"), 1200);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white">
      {/* Ambient glows */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-lime-400/15 blur-3xl"
        {...orbFloat}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-28 -right-28 h-[28rem] w-[28rem] rounded-full bg-yellow-400/10 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block h-[3px] w-[3px] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor:
                Math.random() > 0.5
                  ? "rgba(190,255,150,0.9)"
                  : "rgba(255,255,150,0.8)",
              filter: "drop-shadow(0 0 8px rgba(210,255,170,0.9))",
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top tag */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-lime-400/20 bg-white/5 px-4 py-2 backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-lime-400" />
          <span className="text-xs text-lime-200/90">
            Vespera • Profile Setup
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="h-full w-full px-4 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 place-items-center">
        {/* LEFT: Visual Hero */}
        <div className="relative hidden lg:flex h-[82vh] w-full items-center justify-center">
          <motion.div
            className="absolute -z-0 h-[460px] w-[460px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(190,255,150,0.2), rgba(255,255,150,0.08), transparent 70%)",
              filter: "drop-shadow(0 0 24px rgba(255,255,150,0.25))",
            }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative z-10 rounded-3xl border border-lime-400/20 bg-white/5 backdrop-blur-2xl p-6"
            style={{ width: 420 }}
            {...pulseBorder}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-lime-400/20 bg-gradient-to-b from-gray-900/50 to-gray-900/20">
              <img
                src={heroImg}
                alt="3D Character"
                className="h-full w-full object-contain"
              />
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                  background: [
                    "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)",
                    "linear-gradient(105deg,transparent 60%,rgba(255,255,255,0.06) 70%,transparent 80%)",
                    "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)",
                  ],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-lime-200/80">Welcome to</p>
                <h3 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
                  Vespera Nexus
                </h3>
              </div>
              <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs text-lime-200">
                Live Preview
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute -left-6 bottom-20">
            <TechChip label="HTML" />
          </motion.div>
          <motion.div className="absolute right-6 top-16">
            <TechChip label="CSS" />
          </motion.div>
          <motion.div className="absolute -right-8 bottom-12">
            <TechChip label="JS" />
          </motion.div>
          <motion.div className="absolute left-8 top-10">
            <TechChip label="React" />
          </motion.div>
        </div>

        {/* RIGHT: Form */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-[82vh] w-full max-w-[640px]"
        >
          <motion.div
            className="absolute inset-0 rounded-3xl border border-lime-400/25 bg-white/5 backdrop-blur-2xl"
            {...pulseBorder}
          />
          <div className="absolute left-0 right-0 top-0 mx-auto h-12 rounded-t-3xl bg-gradient-to-b from-lime-400/25 to-transparent" />

          <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
                  Create Your Profile
                </h1>
                <p className="text-lime-200/70 text-xs sm:text-sm">
                  A polished identity helps teammates recognize your work.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="group inline-flex items-center gap-2 rounded-xl border border-lime-400/25 bg-white/5 px-3 py-2 text-xs text-lime-100 hover:border-lime-400/40 hover:bg-lime-400/10 transition"
              >
                <LayoutDashboard
                  size={16}
                  className="group-hover:rotate-6 transition"
                />
                Dashboard
              </button>
            </header>

            {err && (
              <div className="mb-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {err}
              </div>
            )}
            {ok && (
              <div className="mb-3 rounded-xl border border-lime-400/30 bg-lime-500/10 px-3 py-2 text-sm text-lime-200">
                {ok}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-none"
            >
              <Field
                icon={<User className="w-4 h-4" />}
                label="Full Name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Raghav Kaushal"
                required
              />
              <Field
                icon={<Phone className="w-4 h-4" />}
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
                placeholder="+91 98765 43210"
                required
              />
              <GlassDatePickerField
                label="Date of Birth"
                value={form.dob}
                onChange={onChange}
              />
              <GenderSelect value={form.gender} onChange={onChange} />
              <Field
                icon={<MapPin className="w-4 h-4" />}
                label="Address"
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="City, Country"
                className="sm:col-span-2"
              />
              <TextArea
                icon={<Quote className="w-4 h-4" />}
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={onChange}
                placeholder="A short line about you..."
                rows={2}
                className="sm:col-span-2"
              />
              <Field
                icon={<ImageIcon className="w-4 h-4" />}
                label="Profile Picture URL (optional)"
                name="profilePic"
                value={form.profilePic}
                onChange={onChange}
                placeholder="https://…/avatar.png"
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2 mt-1 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-gray-900
                  bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 bg-[length:220%_100%]
                  hover:shadow-[0_0_35px_rgba(190,255,150,0.35)]
                  disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Saving..." : "Save Profile"}
                </button>

                <span className="text-xs text-lime-200/70">
                  Fields marked required must be filled.
                </span>
              </div>
            </form>

            <div className="mt-auto h-10 w-full">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-lime-400/40 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ----- UI components ----- */

function Label({ children }) {
  return (
    <span className="text-[11px] uppercase tracking-wide text-lime-300/80">
      {children}
    </span>
  );
}

function Field({ icon, label, className = "", ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lime-300/70">
          {icon}
        </div>
        <input
          {...props}
          className="w-full rounded-xl border border-lime-400/25 bg-[#11221c] pl-9 pr-3 py-2.5 text-sm 
                     text-lime-100 placeholder-lime-200/40 outline-none 
                     focus:ring-2 focus:ring-lime-400/40 hover:bg-[#153029] 
                     transition-all duration-200"
        />
      </div>
    </div>
  );
}

function TextArea({ icon, label, className = "", rows = 2, ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-3 text-lime-300/70">
          {icon}
        </div>
        <textarea
          rows={rows}
          {...props}
          className="w-full rounded-xl border border-lime-400/25 bg-[#11221c] pl-9 pr-3 py-2.5 text-sm 
                     text-lime-100 placeholder-lime-200/40 outline-none 
                     focus:ring-2 focus:ring-lime-400/40 hover:bg-[#153029] 
                     resize-none transition-all duration-200"
        />
      </div>
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label>Gender</Label>
      <div className="relative">
        <select
          name="gender"
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-lime-400/25 bg-[#11221c] px-3 py-2.5 pr-9 text-sm 
             text-lime-100 outline-none focus:ring-2 focus:ring-lime-400/40 
             hover:bg-[#153029] transition-all duration-200 appearance-none"
          required
        >
          <option value="">Select</option>
          <option value="Male" className="text-black">
            Male
          </option>
          <option value="Female" className="text-black">
            Female
          </option>
          <option value="Other" className="text-black">
            Other
          </option>
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-lime-400" />
      </div>
    </div>
  );
}

function GlassDatePickerField({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative w-full h-[42px] rounded-xl border border-lime-400/25 bg-[#11221c] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full -translate-y-[1px]">
            <GlassDatePicker
              value={value}
              onChange={(e) =>
                onChange({
                  target: { name: "dob", value: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TechChip({ label }) {
  return (
    <motion.div
      className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs text-lime-200 shadow-[0_0_20px_rgba(190,255,150,0.25)]"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {label}
    </motion.div>
  );
}
