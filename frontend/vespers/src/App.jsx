import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";

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
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // ✅ Show loader only on first mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Page fade animation
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: "easeInOut" },
  };

  if (loading) return <Loader />; // ⛔️ No AnimatePresence here, avoids flicker

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-emerald-900">
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
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
