import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌱 Farm Connect</div>
        <ul className="nav-links">
          <li>Features</li>
          <li>How It Works</li>
          <li>Benefits</li>
          <button className="get-started-btn" onClick={() => navigate("/register")}>Get Started</button>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <span className="tag">🌾 Fresh from Farm to Table</span>
          <h1>
            Direct Connection Between <br /> <span>Farmers</span> and <span>You</span>
          </h1>
          <p>
            Skip the middleman. Get fresh, organic produce directly from local
            farmers. Support sustainable agriculture while enjoying farm-fresh
            quality at fair prices.
          </p>
        </div>
        <div className="hero-img">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800"
            alt="Farm"
          />
        </div>
      </section>

      {/* Why Choose */}
      <section className="why-choose">
        <h2>Why Choose Farm Connect?</h2>
        <p className="subtitle">We bring transparency, quality, and sustainability to your food choices</p>

        <div className="features">
          <div className="feature-card">
            <div className="icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Direct Connection</h3>
            <p>
              Connect directly with local farmers. Know exactly where your food
              comes from and who grows it.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h3>Fast Delivery</h3>
            <p>
              Farm-fresh produce delivered to your doorstep within 24 hours of
              harvest.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Quality Assured</h3>
            <p>
              Every product is certified organic and meets our strict quality
              standards.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="subtitle">Simple, transparent, and efficient</p>
        
        <div className="steps-timeline">
          <div className="step">
            <div className="step-circle">01</div>
            <h4>Browse</h4>
            <p>Explore fresh produce from local farmers in your area</p>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="step">
            <div className="step-circle">02</div>
            <h4>Select</h4>
            <p>Choose the products you want and add them to your cart</p>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="step">
            <div className="step-circle">03</div>
            <h4>Connect</h4>
            <p>Place your order directly with the farmer</p>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="step">
            <div className="step-circle">04</div>
            <h4>Enjoy</h4>
            <p>Receive farm-fresh produce at your doorstep</p>
          </div>
        </div>
      </section>

      {/* Supporting Local Farmers Section */}
      <section className="support-section">
        <div className="support-container">
          <div className="support-img">
            <img
              src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&q=80"
              alt="Supporting Local Farmers"
            />
          </div>

          <div className="support-text">
            <h2>
              Supporting Local Farmers, <br /> Nourishing Communities
            </h2>
            <p>
              When you choose Farm Connect, you're not just buying produce.
              You're supporting sustainable agriculture, local economies, and
              healthier communities.
            </p>
            <ul className="support-benefits">
              <li>
                <div className="benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                Fair prices for farmers, affordable rates for consumers
              </li>
              <li>
                <div className="benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                100% organic and sustainable farming practices
              </li>
              <li>
                <div className="benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                Support your local community and reduce carbon footprint
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Experience Farm-Fresh Quality?</h2>
        <p>
          Join thousands of satisfied customers enjoying the best produce from
          local farms
        </p>
        <div className="cta-buttons">
          <button className="primary" onClick={() => navigate("/register")}>Get Started Today →</button>
          <button className="secondary" onClick={() => navigate("/register")}>Register Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🌱 Farm Connect</h3>
            <p>
              Bridging the gap between farmers and consumers for a sustainable
              future.
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