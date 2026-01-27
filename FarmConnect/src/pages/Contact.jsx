import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import "../styles/Contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 1. Add loading, error, and submitted states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 2. Get API URL
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. Update handleSubmit to call the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("❌ Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      // 4. Send the form data to the backend
      // This is a public route, so no token is needed.
      await axios.post(`${API_URL}/contact`, formData);

      setLoading(false);
      setSubmitted(true); // Show success message
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form

      // Optional: hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      {/* Navbar (No changes) */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          🌱 Farm Connect
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </li>
          <li onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
            About
          </li>
          <li onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
            Contact
          </li>
        </ul>
      </nav>

      {/* Hero Section (No changes) */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get In Touch With Us</h1>
          <p>We'd love to hear from you. Send us a message anytime!</p>
        </div>
      </section>

      {/* Contact Container (No changes) */}
      <div className="contact-container">
        {/* Left Side - Contact Info (No changes) */}
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          {/* ... all info-cards ... */}
          <div className="info-card">
            <div className="icon-box">📞</div>
            <div className="info-content">
              <h3>Phone</h3>
              <p>+91 8765 432 109</p>
              <p className="small-text">Mon-Fri, 9 AM - 6 PM</p>
            </div>
          </div>
          <div className="info-card">
            <div className="icon-box">✉️</div>
            <div className="info-content">
              <h3>Email</h3>
              <p>support@farmconnect.com</p>
              <p className="small-text">We'll respond within 24 hours</p>
            </div>
          </div>
          <div className="info-card">
            <div className="icon-box">📍</div>
            <div className="info-content">
              <h3>Address</h3>
              <p>123 Agricultural Road</p>
              <p>Tiruppur, Tamil Nadu 641 603</p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form (Updated) */}
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>

          {/* 5. Add error and success message display */}
          {submitted && (
            <div className="success-message">
              ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
            </div>
          )}
          {error && (
            <div className="success-message" style={{ background: '#f8d7da', color: '#721c24', borderLeftColor: '#f5c6cb' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here... Tell us how we can help!"
                rows="6"
                required
              ></textarea>
            </div>

            {/* 6. Disable button on loading */}
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Sending...' : '📧 Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer (No changes) */}
      <footer className="footer">
        {/* ... footer content ... */}
      </footer>
    </div>
  );
}