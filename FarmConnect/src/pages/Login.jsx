import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // This is 'Farmer' or 'Consumer'
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("❌ Please select a role!");
      return;
    }
    if (!email || !password) {
      setError("❌ Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Send login data to the backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role // 'Farmer' or 'Consumer'
      });

      const { token, user } = response.data;

      // ===================================================================
      // !! CRITICAL STEP !!
      // Save the token based on the user's role. This is what AddCrop.jsx needs.
      //
      if (user.role === 'Farmer') {
        localStorage.setItem('farmerToken', token);
      } else if (user.role === 'Consumer') {
        localStorage.setItem('consumerToken', token);
      }
      
      // Also save user info
      localStorage.setItem("currentUser", JSON.stringify(user));
      // ===================================================================

      setLoading(false);
      alert(`✅ Welcome back, ${user.name}!`);

      // Navigate to the correct dashboard
      if (user.role === "Farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/consumer-dashboard");
      }

    } catch (err) {
      setLoading(false);
      // Show error from backend (e.g., "Invalid credentials")
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-content">
          <h1 className="brand-logo">🌱 Farm Connect</h1>
          <h2 className="brand-tagline">Welcome Back!</h2>
          <p className="brand-description">
            Login to access fresh, organic produce directly from local farmers.
            Continue supporting sustainable agriculture and healthy communities.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Fresh produce from local farms</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Fast delivery within 24 hours</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Quality assured organic products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2 className="form-title">Login to Your Account</h2>
          <p className="form-subtitle">Continue your journey with Farm Connect</p>
          
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="Consumer"
                  checked={role === "Consumer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-card">
                  <span className="role-icon">🛒</span>
                  <span className="role-label">Consumer</span>
                </div>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="Farmer"
                  checked={role === "Farmer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-card">
                  <span className="role-icon">🌾</span>
                  <span className="role-label">Farmer</span>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="forgot-password">
              <span className="link">Forgot Password?</span>
            </div>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account?{" "}
              <span className="link" onClick={() => navigate("/register")}>
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}