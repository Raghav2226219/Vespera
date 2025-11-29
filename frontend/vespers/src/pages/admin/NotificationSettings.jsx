import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Mail, Bell, Clock, Loader2, CheckCircle } from "lucide-react";
import api from "../../api/axios";

const NotificationSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      setSettings(res.data);
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
      setTimeout(() => setMessage(""), 3000);
      fetchSettings(); // Refresh to ensure sync
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = (type, field, value) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [type]: {
          ...prev.emailTemplates[type],
          [field]: value,
        },
      },
    }));
  };

  const handleToggleChange = (type) => {
    const newValue = !settings.notifications[type];
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: newValue,
      },
    }));
    handleSave("notifications", { ...settings.notifications, [type]: newValue });
  };

  const handleReminderChange = (e) => {
    const value = e.target.value;
    setSettings((prev) => ({
      ...prev,
      reminders: { defaultTiming: value },
    }));
    handleSave("reminders", { defaultTiming: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Notification & Email Settings</h1>
        <p className="text-gray-400 mt-2">Manage email templates, notification preferences, and reminders.</p>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.includes("Failed") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {message}
        </motion.div>
      )}

      {/* Notification Toggles */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-500" /> Global Notification Toggles
        </h2>
        <div className="flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings?.notifications?.email ? "bg-yellow-500" : "bg-gray-600"
              }`}
              onClick={() => handleToggleChange("email")}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings?.notifications?.email ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Email Notifications</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings?.notifications?.inApp ? "bg-yellow-500" : "bg-gray-600"
              }`}
              onClick={() => handleToggleChange("inApp")}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings?.notifications?.inApp ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">In-App Notifications</span>
          </label>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Default Reminder Timing
        </h2>
        <div className="max-w-xs">
          <label className="block text-sm text-gray-400 mb-2">Send reminder before deadline:</label>
          <select
            value={settings?.reminders?.defaultTiming}
            onChange={handleReminderChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="1h">1 Hour Before</option>
            <option value="24h">24 Hours Before</option>
            <option value="48h">48 Hours Before</option>
            <option value="1w">1 Week Before</option>
          </select>
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-400" /> Email Templates
        </h2>

        {["invite", "mention", "deadline"].map((type) => (
          <div key={type} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white capitalize">{type} Email</h3>
              <button
                onClick={() => handleSave("emailTemplates", settings.emailTemplates)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={settings?.emailTemplates?.[type]?.subject || ""}
                  onChange={(e) => handleTemplateChange(type, "subject", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Body</label>
                <textarea
                  rows={4}
                  value={settings?.emailTemplates?.[type]?.body || ""}
                  onChange={(e) => handleTemplateChange(type, "body", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
