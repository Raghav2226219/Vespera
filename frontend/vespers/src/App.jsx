import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Profile from "./pages/Auth/Profile";
// import BoardDetails from "./pages/BoardDetails";
// import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="profile" element={<Profile />} />


          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/boards/:id" element={<BoardDetails/>}/> */}
          {/* <Route path="/profile" element={<Profile/>}/> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
