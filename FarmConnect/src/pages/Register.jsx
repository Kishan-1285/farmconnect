import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("consumer"); // 'consumer' or 'farmer'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Use VITE_API_URL from your .env file
  const API_URL = import.meta.env.VITE_API_URL;

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!fullName.trim()) {
      setError("❌ Full name is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("❌ Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        fullName,
        email,
        password,
        userType // 'consumer' or 'farmer'
      };

      // Send the POST request to the backend
      await axios.post(`${API_URL}/auth/register`, newUser);

      setLoading(false);
      alert("✅ Registration successful! You can now login.");
      navigate("/login");

    } catch (err) {
      // Show error from backend (e.g., "Email already in use")
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="brand-content">
          <h1 className="brand-logo">🌱 Farm Connect</h1>
          <h2 className="brand-tagline">Join Our Community</h2>
          <p className="brand-description">
            Connect directly with local farmers and consumers. Experience fresh,
            organic produce and support sustainable agriculture.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Direct farm-to-table connection</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>100% organic produce</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Support local farmers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="register-right">
        <div className="register-form-container">
          <h2 className="form-title">Create Your Account</h2>
          <p className="form-subtitle">Start your journey with Farm Connect</p>
          
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

          <form onSubmit={handleRegister} className="register-form">
            <div className="user-type-selection">
              <label className="user-type-option">
                <input
                  type="radio"
                  name="userType"
                  value="consumer"
                  checked={userType === "consumer"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <div className="type-card">
                  <span className="type-icon">🛒</span>
                  <span className="type-label">Consumer</span>
                </div>
              </label>

              <label className="user-type-option">
                <input
                  type="radio"
                  name="userType"
                  value="farmer"
                  checked={userType === "farmer"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <div className="type-card">
                  <span className="type-icon">🌾</span>
                  <span className="type-label">Farmer</span>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
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
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="register-btn" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account?{" "}
              <span className="link" onClick={() => navigate("/login")}>
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}