import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import "../styles/FarmerDashboard.css";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  // Get user from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem("currentUser")); 

  // 1. Add state for stats
  const [stats, setStats] = useState({ totalCrops: 0, activeListings: 0 });
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // 2. Fetch the farmer's stats when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("farmerToken");
        if (!token) {
          navigate('/login'); // Not logged in
          return;
        }

        // 3. Call the "my-crops" endpoint
        const response = await axios.get(`${API_URL}/crops/my-crops/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 4. Calculate stats from the response
        const crops = response.data.data;
        const totalCrops = crops.length;
        const activeListings = crops.filter(crop => crop.status === 'active').length;

        setStats({ totalCrops, activeListings });

      } catch (err) {
        console.error("Failed to fetch farmer stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Run once on load


  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("farmerToken"); // Clear the token
    navigate("/");
  };

  return (
    <div className="farmer-dashboard">
      {/* Header (No change) */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate("/")}>
            🌱 Farm Connect
          </div>
          <div className="header-right">
            <span className="user-greeting">Welcome, {user?.name || "Farmer"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (No change) */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-title">Farmer Dashboard 👨‍🌾</h1>
          <p className="welcome-subtitle">
            Manage your crops, track inventory, and connect with consumers
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate('/add-crop')}>
            <div className="card-icon">➕</div>
            <h3 className="card-title">Add New Crop</h3>
            <p className="card-description">List a new crop for sale</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/my-crops')}>
            <div className="card-icon">🌾</div>
            <h3 className="card-title">My Crops</h3>
            <p className="card-description">View and manage your crops</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/available-crops')}>
            <div className="card-icon">🛒</div>
            <h3 className="card-title">Browse Crops</h3>
            <p className="card-description">See all approved crops</p>
          </div>
        </div>

        {/* Quick Stats (Updated to use state) */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">🌾</div>
            <div className="stat-content">
              <h4>Total Crops</h4>
              <p className="stat-value">{loading ? '...' : stats.totalCrops}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h4>Active Listings</h4>
              <p className="stat-value">{loading ? '...' : stats.activeListings}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h4>Status</h4>
              <p className="stat-value">Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;