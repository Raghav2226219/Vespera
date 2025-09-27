import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/user/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {user ? (
          <>
            {/* ✅ User info */}
            <div className="mb-6">
              <p className="text-lg font-semibold">👋 Welcome, {user.name}</p>
              <p className="text-gray-600">📧 {user.email}</p>
              <p className="text-gray-600">🛠 Role: {user.role}</p>
            </div>

            {/* ✅ Example boards (dummy for now) */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Your Boards</h2>
              <ul className="space-y-2">
                <li className="p-3 bg-blue-100 rounded">📌 Project Roadmap</li>
                <li className="p-3 bg-green-100 rounded">📌 Marketing Plan</li>
                <li className="p-3 bg-yellow-100 rounded">📌 Personal Tasks</li>
              </ul>
            </div>

            {/* ✅ Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/boards")}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Go to Boards Page
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
