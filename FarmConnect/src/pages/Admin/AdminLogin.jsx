import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client'; // API client
import '../../styles/Admin/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state for button

  const handleChange = (e) => {
    setFormData({ 
      
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const response = await api.post('/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });

      // If login is successful, backend sends back a token
      if (response.data.success) {
        // Store the token (just like you stored the demo token)
        localStorage.setItem('adminToken', response.data.token);

        // Navigate to the dashboard
        navigate('/admin/dashboard');
      }

    } catch (err) {
      // If backend sends an error (like "Invalid credentials")
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left Section (No changes) */}
      <div className="admin-login-left">
        <div className="admin-brand-content">
          <h1 className="admin-brand-logo">🌱 Farm Connect</h1>
          <h2 className="admin-brand-tagline">Admin Control Panel</h2>
          <p className="admin-brand-description">
            Manage your entire Farm Connect platform from one powerful dashboard.
            Monitor users, oversee transactions, and ensure quality across the community.
          </p>
          <div className="admin-features-list">
            <div className="admin-feature-item">
              <span className="admin-feature-icon">✓</span>
              <span>Comprehensive user management</span>
            </div>
            <div className="admin-feature-item">
              <span className="admin-feature-icon">✓</span>
              <span>Real-time platform analytics</span>
            </div>
            <div className="admin-feature-item">
              <span className="admin-feature-icon">✓</span>
              <span>Secure administrative access</span>
            </div>
            <div className="admin-feature-item">
              <span className="admin-feature-icon">✓</span>
              <span>Complete transaction oversight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Form updated) */}
      <div className="admin-login-right">
        <div className="admin-login-form-container">
          <h2 className="admin-form-title">Administrator Login</h2>
          <p className="admin-form-subtitle">Secure access for authorized administrators only</p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Show error message from the API */}
            {error && <div className="admin-error-message">{error}</div>}

            <div className="admin-form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
              />
            </div>

            {/* Disable button while loading */}
            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Accessing...' : 'Access Dashboard'}
            </button>

            <div className="admin-security-note">
              <span className="security-icon">🔒</span>
              <span>This area is restricted to authorized personnel only</span>
            </div>
          </form>

          <div className="admin-form-footer">
            <button className="back-home-btn" onClick={() => navigate('/')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
