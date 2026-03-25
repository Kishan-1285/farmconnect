import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }
    setMessage("If an account exists, a reset link has been sent to your email.");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-content">
          <h1 className="brand-logo">Farm Connect</h1>
          <h2 className="brand-tagline">Reset Your Password</h2>
          <p className="brand-description">
            Enter the email linked to your account and we will send you a password reset link.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2 className="form-title">Forgot Password</h2>
          <p className="form-subtitle">We will email you a reset link</p>

          {message && (
            <p style={{ color: "#1a1a1a", textAlign: "center", marginBottom: "1rem" }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="login-btn">
              Send Reset Link
            </button>
          </form>

          <div className="form-footer">
            <p>
              <button
                type="button"
                className="link link-button"
                onClick={() => navigate("/login")}
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
