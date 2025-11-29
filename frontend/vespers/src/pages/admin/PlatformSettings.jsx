import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sliders,
  Shield,
  UserPlus,
  AlertTriangle,
  Save,
  Loader2,
  Server,
  Lock,
} from "lucide-react";
import api from "../../api/axios";

const PlatformSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    allow_signups: true,
    max_board_size: 100,
    password_policy: {
      minLength: 8,
      requireSpecialChar: false,
    },
    rate_limits: {
      windowMs: 900000,
      max: 100,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      setSettings((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key, value) => {
    setSaving(true);
    try {
      await api.put("/admin/settings", { key, value });
      setMessage("Settings saved successfully!");
      setSettings((prev) => ({ ...prev, [key]: value }));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parent, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sliders className="w-8 h-8 text-yellow-500" /> Platform Configurations
        </h1>
        <p className="text-gray-400 mt-2">
          Manage global settings, security policies, and system limits.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Maintenance Mode */}
          <div className="bg-[#0b1914]/50 border border-white/10 p-6 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Maintenance Mode</h3>
                  <p className="text-sm text-gray-400">
                    Disable access for non-admin users.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.maintenance_mode}
                  onChange={(e) => handleSave("maintenance_mode", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>

          {/* New User Signups */}
          <div className="bg-[#0b1914]/50 border border-white/10 p-6 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <UserPlus className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">New User Signups</h3>
                  <p className="text-sm text-gray-400">
                    Allow new users to register.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.allow_signups}
                  onChange={(e) => handleSave("allow_signups", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          {/* System Limits */}
          <div className="bg-[#0b1914]/50 border border-white/10 p-6 rounded-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white">System Limits</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Max Board Size (Tasks)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.max_board_size}
                    onChange={(e) => handleChange("max_board_size", parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50"
                  />
                  <button
                    onClick={() => handleSave("max_board_size", settings.max_board_size)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Rate Limit (Max Requests / 15min)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.rate_limits?.max || 100}
                    onChange={(e) =>
                      handleNestedChange("rate_limits", "max", parseInt(e.target.value))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50"
                  />
                  <button
                    onClick={() => handleSave("rate_limits", settings.rate_limits)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Password Policy */}
          <div className="bg-[#0b1914]/50 border border-white/10 p-6 rounded-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Lock className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Password Policy</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Minimum Length</p>
                  <p className="text-sm text-gray-400">
                    Minimum number of characters required.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.password_policy?.minLength || 8}
                    onChange={(e) =>
                      handleNestedChange("password_policy", "minLength", parseInt(e.target.value))
                    }
                    className="w-20 bg-black/20 border border-white/10 rounded-lg p-2 text-white text-center focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Require Special Character</p>
                  <p className="text-sm text-gray-400">
                    Enforce at least one special character (!@#$%).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.password_policy?.requireSpecialChar || false}
                    onChange={(e) =>
                      handleNestedChange(
                        "password_policy",
                        "requireSpecialChar",
                        e.target.checked
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSave("password_policy", settings.password_policy)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium"
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

export default PlatformSettings;
