import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
// import BoardDetails from "./pages/BoardDetails";
// import Profile from "./pages/Profile";
// import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
