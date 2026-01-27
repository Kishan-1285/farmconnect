import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Header */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>🌱 Farm Connect</div>
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/about")}>About Us</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <button className="get-started-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Farm Connect</h1>
          <p>Connecting Farmers and Consumers for a Sustainable Future</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              Farm Connect was born from a simple yet powerful idea: to bridge the gap 
              between local farmers and conscious consumers. We believe in creating a 
              direct connection that benefits everyone involved.
            </p>
            <p>
              Our platform empowers farmers to showcase their produce directly to consumers, 
              eliminating middlemen and ensuring fair prices. For consumers, we provide 
              access to fresh, organic, and locally-sourced produce while supporting 
              sustainable agriculture.
            </p>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" 
              alt="Farm" 
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>
              We promote eco-friendly farming practices and reduce carbon footprint 
              by connecting local producers with nearby consumers.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Fair Trade</h3>
            <p>
              Farmers receive fair compensation for their hard work while consumers 
              get competitive prices for quality produce.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">💚</div>
            <h3>Community</h3>
            <p>
              We build strong local communities by fostering direct relationships 
              between farmers and consumers.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">✨</div>
            <h3>Quality</h3>
            <p>
              Every product on our platform is certified organic and meets 
              strict quality standards for freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Local Farmers</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Happy Consumers</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Organic Produce</p>
          </div>
          <div className="stat-item">
            <h3>24hrs</h3>
            <p>Delivery Time</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <h2>Our Story</h2>
          <p>
            Farm Connect started in 2024 with a vision to revolutionize how fresh produce 
            reaches consumers. We noticed that farmers were struggling to get fair prices 
            for their crops, while consumers were paying premium prices for produce that 
            had traveled long distances.
          </p>
          <p>
            Our founders, passionate about sustainable agriculture and technology, created 
            a platform that eliminates unnecessary intermediaries. Today, Farm Connect serves 
            thousands of families across the region, connecting them directly with local farmers.
          </p>
          <p>
            We're more than just a marketplace – we're a community committed to supporting 
            local agriculture, promoting healthy eating, and building a more sustainable 
            food system for future generations.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Join Our Growing Community</h2>
        <p>Be part of the movement towards sustainable, local agriculture</p>
        <div className="cta-buttons">
          <button className="primary" onClick={() => navigate("/register")}>
            Get Started Today →
          </button>
          <button className="secondary" onClick={() => navigate("/contact")}>
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🌱 Farm Connect</h3>
            <p>
              Bridging the gap between farmers and consumers for a sustainable future.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>For Consumers</h4>
              <ul>
                <li onClick={() => navigate("/consumer-dashboard")}>Browse Products</li>
                <li onClick={() => navigate("/available-crops")}>Available Crops</li>
                <li onClick={() => navigate("/cart")}>My Cart</li>
              </ul>
            </div>

            <div>
              <h4>For Farmers</h4>
              <ul>
                <li onClick={() => navigate("/farmer-dashboard")}>Seller Dashboard</li>
                <li onClick={() => navigate("/add-crop")}>Add Crop</li>
                <li onClick={() => navigate("/my-crops")}>My Crops</li>
              </ul>
            </div>

            <div>
              <h4>Company</h4>
              <ul>
                <li onClick={() => navigate("/about")}>About Us</li>
                <li onClick={() => navigate("/contact")}>Contact</li>
                <li onClick={() => navigate("/privacy")}>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}