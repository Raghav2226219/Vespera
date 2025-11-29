import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";
import api from "./api/axios";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ViewBoards from "./pages/ViewBoard";
import NewBoard from "./pages/NewBoard";
import ProfileCheck from "./pages/Profile/ProfileCheck";
import ProfileMe from "./pages/Profile/ProfileMe";
import ProfileCreate from "./pages/Profile/ProfileCreate";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import BoardPage from "./pages/BoardPage";
import TrashPage from "./pages/TrashPage";
import BoardDetails from "./pages/BoardDetails";
import InviteMembers from "./pages/InviteMembers";
import ArchivePage from "./pages/ArchivePage";
import InviteAuditsAllPage from "./pages/InviteAuditsAllPage";
import BoardAuditsPage from "./pages/BoardAuditsPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TaskAuditsPage from "./pages/TaskAuditsPage";
import AdminLayout from "./layouts/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import BoardManagement from "./pages/admin/BoardManagement";
import TaskManagement from "./pages/admin/TaskManagement";
import InviteManagement from "./pages/admin/InviteManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import NotificationSettings from "./pages/admin/NotificationSettings";
import PremiumManagement from "./pages/admin/PremiumManagement";
import PlatformSettings from "./pages/admin/PlatformSettings";
import SystemLogs from "./pages/admin/SystemLogs";
import MaintenancePage from "./pages/MaintenancePage";
import SuspendedPage from "./pages/SuspendedPage";

function App() {
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    const handleMaintenance = () => setMaintenance(true);
    window.addEventListener("maintenance", handleMaintenance);
    return () => window.removeEventListener("maintenance", handleMaintenance);
  }, []);

  return (
    <Router>
      {maintenance && <MaintenancePage />}
      <AnimatedRoutes />
    </Router>
  );
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Show loader only on first mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Check for suspension & fresh user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // Optimistically set from local storage first
          setUser(JSON.parse(storedUser));
          
          // Then verify with backend
          const { data } = await api.get("/user/me");
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user status:", error);
        setUser(null); // Clear user on error (e.g. 401)
      }
    };

    if (location.pathname === "/login" || location.pathname === "/register") {
      setLoading(false);
      return;
    }

    fetchUser();
  }, [location.pathname]);

  // ✅ Page fade animation
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: "easeInOut" },
  };

  if (loading) return <Loader />; // ⛔️ No AnimatePresence here, avoids flicker

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900 relative">
      {/* ✅ Suspension Overlay */}
      {user?.isSuspended && <SuspendedPage />}

      {/* ✅ Single AnimatePresence — only for route transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          {...pageTransition}
          className="min-h-screen"
        >
          <Routes location={location}>
            {/* Auth Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileCheck />} />
            <Route path="/profile/create" element={<ProfileCreate />} />
            <Route path="/profile/me" element={<ProfileMe />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/boards" element={<ViewBoards />} />
            <Route path="/newboard" element={<NewBoard />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/board-details/:id" element={<BoardDetails />} />
            <Route path="/invite" element={<InviteMembers />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/invite-audits" element={<InviteAuditsAllPage />} />
            <Route path="/board-audits" element={<BoardAuditsPage />} />
            <Route path="/task-audits" element={<TaskAuditsPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="boards" element={<BoardManagement />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="invites" element={<InviteManagement />} />
              <Route path="activity" element={<ActivityLogs />} />
              <Route path="premium" element={<PremiumManagement />} />
              <Route path="platform" element={<PlatformSettings />} />
              <Route path="logs" element={<SystemLogs />} />
              <Route path="settings" element={<NotificationSettings />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
