import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Quote,
  Mail,
  ChevronDown,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import api from "../../api/axios";
import GlassDatePicker from "../../components/inviteAudits/GlassDatePicker";
import VesperaHologram from "../../components/VesperaHologram";
import { useNavigate } from "react-router-dom";

/* Glow animations */
const glowPulse = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
};

const float = {
  animate: { y: [0, -6, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
};

export default function ProfileEdit() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  /** Load User + Profile Data **/
  useEffect(() => {
    const load = async () => {
      try {
        const u = await api.get("/user/me");
        const p = await api.get("/profile/me");

        const profile = p.data || {};

        setForm({
          name: u.data?.name || "",
          phoneNumber: u.data?.phonenumber || "",
          email: u.data?.email || "",
          dob: profile.dob ? profile.dob.split("T")[0] : "",
          gender: profile.gender || "",
          address: profile.address || "",
          bio: profile.bio || "",
        });
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    load();
  }, []);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /** Save Updates **/
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setOk("");
    setLoading(true);

    try {
      await api.put("/user/update-basic", {
        name: form.name,
        phonenumber: form.phoneNumber,
      });

      await api.put("/profile/update", {
        name: form.name,
        phoneNumber: form.phoneNumber,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        bio: form.bio,
      });

      setOk("Profile updated successfully!");
      setTimeout(() => navigate("/profile/me"), 1200);
    } catch (error) {
      setErr(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden bg-gradient-to-br from-[#010805] via-[#031512] to-[#04231b] text-white">

      {/* Background glows */}
      <motion.span
        className="absolute top-24 left-24 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full"
        {...glowPulse}
      />
      <motion.span
        className="absolute bottom-16 right-16 w-[22rem] h-[22rem] bg-yellow-400/20 blur-[120px] rounded-full"
        {...glowPulse}
      />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[32%] h-full flex-col justify-center items-center">
        <motion.div {...float} className="scale-[0.82]">
          <VesperaHologram />
        </motion.div>

        <p className="mt-4 w-52 text-center text-sm text-lime-200/70">
          Update your Nexus identity
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-xl h-[78vh] rounded-3xl border border-lime-400/25 bg-white/5 backdrop-blur-xl p-7 shadow-[0_0_40px_rgba(190,255,150,0.18)] flex flex-col"
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/profile/me")}
            className="absolute top-5 left-5 text-lime-300/80 hover:text-yellow-200 transition"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center mb-1 bg-gradient-to-r from-lime-300 via-yellow-300 to-emerald-200 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-center text-sm text-lime-200/60 mb-4">
            Update your information
          </p>

          {/* Alerts */}
          {err && (
            <p className="text-red-300 bg-red-900/20 border border-red-400/30 text-sm rounded-xl py-2 text-center mb-3">
              {err}
            </p>
          )}
          {ok && (
            <p className="text-emerald-300 bg-emerald-900/20 border border-emerald-400/30 text-sm rounded-xl py-2 text-center mb-3">
              {ok}
            </p>
          )}

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col gap-3 overflow-y-auto pb-20 pr-2 vespera-scroll"
          >
            <Field icon={<Mail />} label="Email (Locked)" name="email" value={form.email} disabled readOnly />

            <Field icon={<User />} label="Full Name" name="name" value={form.name} onChange={onChange} />

            <Field icon={<Phone />} label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />

            <DateField label="Date of Birth" value={form.dob} onChange={onChange} />

            <GenderSelect value={form.gender} onChange={onChange} />

            <Field icon={<MapPin />} label="Address" name="address" value={form.address} onChange={onChange} />

            {/* FIX #2 — Add vespera-scroll */}
            <TextArea
              icon={<Quote />}
              label="Bio"
              name="bio"
              value={form.bio}
              onChange={onChange}
            />
          </form>

          {/* STICKY SAVE BUTTON */}
          <div className="absolute bottom-4 left-0 right-0 px-7">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300 shadow-[0_0_22px_rgba(190,255,150,0.28)] hover:shadow-[0_0_32px_rgba(255,255,150,0.32)] transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Changes"}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

/* --- COMPONENTS --- */

function Field({ icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase text-lime-300/70">{label}</p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-300/60">
          {icon}
        </span>
        <input
          {...props}
          className="w-full rounded-xl bg-[#11221c] border border-lime-400/25 pl-10 pr-3 py-2 text-sm text-lime-100 focus:ring-2 focus:ring-lime-400/40 outline-none"
        />
      </div>
    </div>
  );
}

function TextArea({ icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase text-lime-300/70">{label}</p>
      <div className="relative">
        <span className="absolute left-3 top-3 text-lime-300/60">{icon}</span>

        {/* FIX #2 — custom scrollbar */}
        <textarea
          {...props}
          rows={2}
          className="vespera-scroll w-full rounded-xl bg-[#11221c] border border-lime-400/25 pl-10 pr-3 py-2.5 text-sm text-lime-100 outline-none resize-none overflow-y-auto"
        />
      </div>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase text-lime-300/70">{label}</p>

      <div className="h-[42px] w-full rounded-xl border border-lime-400/25 bg-[#11221c] overflow-hidden">
        <GlassDatePicker
          value={value}
          onChange={(e) =>
            onChange({ target: { name: "dob", value: e.target.value } })
          }
        />
      </div>
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const options = ["Male", "Female", "Other"];

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="space-y-1 relative" ref={ref}>
      <p className="text-[11px] uppercase text-lime-300/70">Gender</p>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full h-[42px] px-3 rounded-xl bg-[#11221c] border border-lime-400/25 flex justify-between items-center text-lime-100"
      >
        {value || "Select"} <ChevronDown className="text-yellow-300" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute w-full mt-2 rounded-xl border border-lime-400/25 bg-[#0f231c] overflow-y-auto z-50"
            style={{ maxHeight: "140px" }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange({ target: { name: "gender", value: opt } });
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm text-lime-100 text-left hover:bg-lime-400/10 ${
                  value === opt ? "bg-lime-400/20" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
