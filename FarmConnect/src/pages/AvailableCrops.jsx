// src/pages/AvailableCrops.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/dashboard.css";

export default function AvailableCrops() {
  const [search, setSearch] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all active crops from the API
  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/crops`);
        setAllCrops(response.data.data);
        setFilteredCrops(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch crops.");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = allCrops.filter((crop) =>
      crop.name.toLowerCase().includes(value)
    );
    setFilteredCrops(filtered);
  };

  // Navigate to dynamic route /crop/:id using MongoDB _id
  const handleViewDetails = (crop) => {
    navigate(`/crop/${crop._id}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>🌾 Available Crops</h2>
        <p style={{ textAlign: 'center' }}>Loading crops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>🌾 Available Crops</h2>
        <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>🌾 Available Crops</h2>

      <input
        type="text"
        placeholder="🔍 Search crops..."
        value={search}
        onChange={handleSearch}
        className="search-bar"
      />

      <div className="crop-grid">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <div
              key={crop._id}
              className="crop-card"
              onClick={() => handleViewDetails(crop)}
              style={{ cursor: "pointer" }}
            >
              <img src={crop.image} alt={crop.name} className="crop-img" />
              <h3>{crop.name}</h3>
              <p>
                <strong>Price:</strong> ₹{crop.price} / kg
              </p>
              <p>{crop.quantity} kg available</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>Farmer: {crop.farmer?.name || 'Unknown'}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No crops found.</p>
        )}
      </div>
    </div>
  );
}
