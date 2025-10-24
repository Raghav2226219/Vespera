// src/pages/Profile/ProfileCheck.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ProfileCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        if (res.data) {
          navigate("/profile/me");
        } else {
          navigate("/profile/create");
        }
      } catch (err) {
        // If 404, assume profile not found → go to create page
        if (err.response && err.response.status === 404) {
          navigate("/profile/create");
        } else {
          console.error(err);
          navigate("/profile/create");
        }
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      {loading ? "Checking your profile..." : null}
    </div>
  );
};

export default ProfileCheck;
