import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function RoleSelect() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) return <h2>Please login first!</h2>;

  return (
    <div className="dashboard-container">
      <h2>Select Your Role</h2>
      <p>Welcome back, {user.name}!</p>

      <div className="button-group">
        <button onClick={() => navigate("/farmer-dashboard")} className="btn">
          I’m a Farmer
        </button>
        <button onClick={() => navigate("/consumer-dashboard")} className="btn">
          I’m a Consumer
        </button>
      </div>
    </div>
  );
}
