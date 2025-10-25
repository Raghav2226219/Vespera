import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    // Show loader briefly on first mount and on route change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader key="route-loader" />}
      </AnimatePresence>

      {!loading && (
        <Routes location={location} key={location.pathname}>
          {/* Auth Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileCheck />} />
          <Route path="/profile/create" element={<ProfileCreate />} />
          <Route path="/profile/me" element={<ProfileMe />} />
          <Route path="/boards" element={<ViewBoards />} />
          <Route path="/newboard" element={<NewBoard />} />
        </Routes>
      )}
    </>
  );
};

export default App;
