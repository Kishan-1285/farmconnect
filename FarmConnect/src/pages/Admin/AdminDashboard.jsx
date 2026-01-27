import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import UserManagement from "./UserManagement";
import CropManagement from "./CropManagement";
import OrderManagement from "./OrderManagement";
import "../../styles/Admin/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // 1. Remove hard-coded stats and add state for API data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalConsumers: 0,
    totalCrops: 0,
    totalRevenue: 0,
    activeOrders: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // 2. Fetch stats when the dashboard component mounts
  useEffect(() => {
    // Only fetch stats if the user is on the dashboard tab
    if (activeMenu === "dashboard") {
      fetchDashboardStats();
    }
  }, [activeMenu]); // Re-fetch if the user navigates back to the dashboard

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error("No admin token found, redirecting to login.");
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${API_URL}/stats/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setStats(response.data.data); // Save the stats object

    } catch (err) {
      console.error("Failed to fetch stats:", err.response?.data?.message || err.message);
      // Handle error, maybe show a toast notification
    } finally {
      setLoadingStats(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate("/admin/login");
  };

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "users":
        return <UserManagement />;
      
      case "crops":
        return <CropManagement />;
      
      case "orders":
        return <OrderManagement />;
      
      case "settings":
        return (
          <section className="content-section">
            <h2 className="section-title">⚙️ Settings</h2>
            <p className="placeholder-text">Settings features coming soon...</p>
          </section>
        );
      
      default: // dashboard
        return (
          <>
            {/* Statistics Cards - Now connected to state */}
            <section className="stats-section">
              {/* Card 1: Total Users */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  👥
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Users</h3>
                  <p className="stat-value">{loadingStats ? '...' : stats.totalUsers}</p>
                </div>
              </div>
              
              {/* Card 2: Total Farmers */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  🌾
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Farmers</h3>
                  <p className="stat-value">{loadingStats ? '...' : stats.totalFarmers}</p>
                </div>
              </div>

              {/* Card 3: Total Consumers */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  🛒
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Consumers</h3>
                  <p className="stat-value">{loadingStats ? '...' : stats.totalConsumers}</p>
                </div>
              </div>

              {/* Card 4: Total Crops */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  🌱
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Crops</h3>
                  <p className="stat-value">{loadingStats ? '...' : stats.totalCrops}</p>
                </div>
              </div>

              {/* Card 5: Total Revenue */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  💰
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Revenue</h3>
                  <p className="stat-value">{loadingStats ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}</p>
                </div>
              </div>

              {/* Card 6: Active Orders */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                  📦
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Active Orders</h3>
                  <p className="stat-value">{loadingStats ? '...' : stats.activeOrders}</p>
                </div>
              </div>
            </section>

            {/* Quick Actions (No changes) */}
            <section className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => setActiveMenu("users")}>
                  <span className="action-icon">➕</span>
                  <span>Manage Users</span>
                </button>
                <button className="action-btn" onClick={() => setActiveMenu("crops")}>
                  <span className="action-icon">✅</span>
                  <span>Manage Crops</span>
                </button>
                <button className="action-btn" onClick={() => setActiveMenu("orders")}>
                  <span className="action-icon">📦</span>
                  <span>Manage Orders</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>View Reports</span>
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="content-section">
              <h2 className="section-title">📊 Recent Activity</h2>
              <p className="placeholder-text">Recent activity feed will be displayed here...</p>
            </section>
          </>
        );
    }
  };

  // --- No changes to the rest of the component ---
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">Farm Connect</span>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "users" ? "active" : ""}`}
            onClick={() => setActiveMenu("users")}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "crops" ? "active" : ""}`}
            onClick={() => setActiveMenu("crops")}
          >
            <span className="nav-icon">🌾</span>
            <span className="nav-text">Crops</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "orders" ? "active" : ""}`}
            onClick={() => setActiveMenu("orders")}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Orders</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "settings" ? "active" : ""}`}
            onClick={() => setActiveMenu("settings")}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeMenu === "dashboard" && "Dashboard Overview"}
              {activeMenu === "users" && "User Management"}
              {activeMenu === "crops" && "Crop Management"}
              {activeMenu === "orders" && "Order Management"}
              {activeMenu === "settings" && "Settings"}
            </h1>
            <p className="page-subtitle">
              {activeMenu === "dashboard" && "Welcome back, Admin! Here's what's happening today."}
              {activeMenu === "users" && "Manage all farmers and consumers in your platform."}
              {activeMenu === "crops" && "Monitor and manage all crop listings."}
              {activeMenu === "orders" && "Track and manage all orders."}
              {activeMenu === "settings" && "Configure your platform settings."}
            </p>
          </div>
          <div className="header-right">
            <div className="admin-profile">
              <span className="profile-icon">👤</span>
              <span className="profile-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Based on Active Menu */}
        {renderContent()}
      </main>
    </div>
  );
}