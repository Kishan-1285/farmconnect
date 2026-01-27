import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Privacy.css";

export default function Privacy() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content:
        "Welcome to Farm Connect. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
    },
    {
      id: "information",
      title: "2. Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, address, and payment information. We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, and pages visited.",
    },
    {
      id: "use",
      title: "3. How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services, process transactions, send promotional communications, and comply with legal obligations. For farmers, we use information to facilitate crop listings and connect them with consumers. For consumers, we use information to process orders and provide personalized recommendations.",
    },
    {
      id: "sharing",
      title: "4. Sharing of Information",
      content:
        "We do not sell, trade, or rent your personal information to third parties. However, we may share information with service providers who assist us in operating our website and conducting our business, subject to strict confidentiality agreements. We may also disclose information when required by law or to protect our rights and safety.",
    },
    {
      id: "security",
      title: "5. Data Security",
      content:
        "We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use SSL encryption for data transmission and maintain secure servers. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      id: "cookies",
      title: "6. Cookies and Tracking",
      content:
        "We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us understand how you use our website and allow us to remember your preferences. You can control cookie settings through your browser, though some features may not function properly if cookies are disabled.",
    },
    {
      id: "rights",
      title: "7. Your Privacy Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt-out of receiving promotional communications at any time. If you are a resident of certain jurisdictions, you may have additional rights under applicable data protection laws. Please contact us to exercise these rights.",
    },
    {
      id: "retention",
      title: "8. Data Retention",
      content:
        "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will remove your information within 30 days, except where we are required by law to retain it for longer periods.",
    },
    {
      id: "children",
      title: "9. Children's Privacy",
      content:
        "Farm Connect is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information immediately.",
    },
    {
      id: "changes",
      title: "10. Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any significant changes by posting the updated policy on our website and updating the 'Last Updated' date. Your continued use of our platform constitutes your acceptance of the updated policy.",
    },
    {
      id: "contact",
      title: "11. Contact Us",
      content:
        "If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@farmconnect.com or call us at +91 8765 432 109. You can also write to us at Farm Connect, 123 Agricultural Road, Tiruppur, Tamil Nadu 641 603.",
    },
  ];

  return (
    <div className="privacy-page">
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="hero-content">
          <h1>Privacy Policy</h1>
          <p>Your privacy matters to us. Learn how we protect your data.</p>
          <p className="last-updated">Last Updated: October 2025</p>
        </div>
      </section>

      {/* Privacy Container */}
      <div className="privacy-container">
        <div className="privacy-intro">
          <p>
            At Farm Connect, we believe transparency is essential. This Privacy Policy outlines how we
            collect, use, and protect your personal information. We are committed to ensuring you have a
            positive experience while maintaining the highest standards of data privacy and security.
          </p>
        </div>

        {/* Expandable Sections */}
        <div className="privacy-sections">
          {sections.map((section) => (
            <div key={section.id} className="section-item">
              <button
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                <span className="section-title">{section.title}</span>
                <span className="chevron">
                  {expandedSections[section.id] ? "▼" : "▶"}
                </span>
              </button>
              {expandedSections[section.id] && (
                <div className="section-content">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info Box */}
        <div className="info-box">
          <h3>📋 Important Information</h3>
          <ul>
            <li>
              <strong>GDPR Compliance:</strong> We comply with the General Data Protection Regulation
              (GDPR) for users in the European Union.
            </li>
            <li>
              <strong>Data Processing:</strong> Your data is processed securely on our certified
              servers with industry-standard encryption.
            </li>
            <li>
              <strong>Third-Party Services:</strong> We use trusted third-party services for payment
              processing and analytics, all of which comply with our privacy standards.
            </li>
            <li>
              <strong>Contact Our Privacy Team:</strong> If you have privacy concerns, contact us
              immediately at privacy@farmconnect.com
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <section className="privacy-cta">
        <div className="cta-content">
          <h2>Have Questions About Your Privacy?</h2>
          <p>Our dedicated team is here to help and answer any concerns you may have.</p>
          <button
            className="cta-btn"
            onClick={() => navigate("/contact")}
          >
            Contact Our Privacy Team
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Farm Connect</h4>
            <ul>
              <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                Home
              </li>
              <li onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
                About Us
              </li>
              <li onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
                Contact
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li onClick={() => navigate("/privacy")} style={{ cursor: "pointer" }}>
                Privacy Policy
              </li>
              <li>Terms & Conditions</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>support@farmconnect.com</li>
              <li>+91 8765 432 109</li>
              <li>Tiruppur, Tamil Nadu</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Farm Connect. All rights reserved. 🌱</p>
        </div>
      </footer>
    </div>
  );
}