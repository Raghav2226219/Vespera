import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ViewBoards from "./pages/ViewBoard";
import NewBoard from "./pages/NewBoard";
import ProfileCheck from "./pages/Profile/ProfileCheck";
import ProfileMe from "./pages/Profile/ProfileMe";
import ProfileCreate from "./pages/Profile/ProfileCreate";
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

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileCheck />} />
          <Route path="/profile/create" element={<ProfileCreate />} />
          <Route path="/profile/me" element={<ProfileMe />} />
          <Route path="/boards" element={<ViewBoards />} />
          <Route path="/newboard" element={<NewBoard />} />
          {/* <Route path="/boards/:id" element={<BoardDetails/>}/> */}
          {/* <Route path="/profile" element={<Profile/>}/> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
