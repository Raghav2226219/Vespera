import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "../../api/axios";

const PremiumManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);

  // Form State for Tier
  const [tierForm, setTierForm] = useState({
    name: "",
    price: "",
    duration: 30,
    features: "",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const res = await api.get("/admin/premium/users");
        setUsers(res.data);
      } else if (activeTab === "tiers") {
        const res = await api.get("/admin/premium/tiers");
        setTiers(res.data);
      } else if (activeTab === "revenue") {
        const res = await api.get("/admin/premium/revenue");
        setRevenueStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? "revoke" : "grant"} premium?`)) return;
    try {
      await api.put(`/admin/premium/users/${userId}`, { isPremium: !currentStatus });
      fetchData();
    } catch (err) {
      console.error("Error toggling premium:", err);
    }
  };

  const handleDeleteTier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tier?")) return;
    try {
      await api.delete(`/admin/premium/tiers/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting tier:", err);
    }
  };

  const handleSaveTier = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...tierForm,
        price: parseFloat(tierForm.price),
        duration: parseInt(tierForm.duration),
        features: tierForm.features.split(",").map((f) => f.trim()), // Simple CSV parsing
      };

      if (editingTier) {
        await api.post("/admin/premium/tiers", { ...payload, id: editingTier.id });
      } else {
        await api.post("/admin/premium/tiers", payload);
      }
      setShowTierModal(false);
      setEditingTier(null);
      setTierForm({ name: "", price: "", duration: 30, features: "", isActive: true });
      fetchData();
    } catch (err) {
      console.error("Error saving tier:", err);
    }
  };

  const openEditModal = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      price: tier.price,
      duration: tier.duration,
      features: Array.isArray(tier.features) ? tier.features.join(", ") : "",
      isActive: tier.isActive,
    });
    setShowTierModal(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Premium Management</h1>
          <p className="text-gray-400 mt-2">Manage subscriptions, pricing tiers, and revenue.</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          {["users", "tiers", "revenue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-[#0b1914]/50 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Premium Since</th>
                    <th className="p-4">Expires At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No premium users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">{user.name}</td>
                        <td className="p-4 text-gray-400">{user.email}</td>
                        <td className="p-4 text-gray-400">
                          {user.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-4 text-gray-400">
                          {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleTogglePremium(user.id, true)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TIERS TAB */}
          {activeTab === "tiers" && (
            <div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    setEditingTier(null);
                    setTierForm({ name: "", price: "", duration: 30, features: "", isActive: true });
                    setShowTierModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Tier
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="bg-[#0b1914]/50 border border-white/10 rounded-xl p-6 hover:border-yellow-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <p className="text-2xl font-bold text-yellow-500 mt-1">${tier.price}</p>
                        <p className="text-sm text-gray-500">per {tier.duration} days</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(tier)}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTier(tier.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Array.isArray(tier.features) &&
                        tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-3 h-3 text-green-500" /> {feature}
                          </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${tier.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {tier.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVENUE TAB */}
          {activeTab === "revenue" && revenueStats && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-white">${revenueStats.totalRevenue.toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Active Subscriptions</p>
                      <h3 className="text-3xl font-bold text-white">{revenueStats.activeSubs}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b1914]/50 border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" /> Revenue Overview
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueStats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false} prefix="$" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                        cursor={{ fill: "#ffffff05" }}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {revenueStats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#eab308" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TIER MODAL */}
      {showTierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0b1914] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingTier ? "Edit Tier" : "Create New Tier"}
            </h2>
            <form onSubmit={handleSaveTier} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={tierForm.name}
                  onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50"
                  placeholder="e.g. Pro Plan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={tierForm.price}
                    onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={tierForm.duration}
                    onChange={(e) => setTierForm({ ...tierForm, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Features (comma separated)</label>
                <textarea
                  rows={3}
                  value={tierForm.features}
                  onChange={(e) => setTierForm({ ...tierForm, features: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500/50 resize-none"
                  placeholder="Unlimited Boards, Priority Support..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={tierForm.isActive}
                  onChange={(e) => setTierForm({ ...tierForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-700"
                />
                <label htmlFor="isActive" className="text-gray-300">Active</label>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowTierModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition-colors"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PremiumManagement;
