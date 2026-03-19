// src/pages/MyCrops.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/client'; // API client
import "../styles/dashboard.css"; // Your existing styles
import { FALLBACK_CROP_IMAGE, getCropImageUrl } from "../utils/cropImage";

const MyCrops = () => {
  // 1. Remove hard-coded data, add loading/error states
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // 2. Fetch the farmer's specific crops on component mount
  useEffect(() => {
    const fetchMyCrops = async () => {
      setLoading(true);
      setError("");
      try {
        // 3. Get the farmer's token
        const token = localStorage.getItem("farmerToken");
        if (!token) {
          setError("Not authorized. Please login as a farmer.");
          setLoading(false);
          navigate('/login');
          return;
        }

        // 4. Make the authorized GET request to the 'my-crops' endpoint
        const response = await api.get('/crops/my-crops/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCrops(response.data.data); // Set state with the fetched crops

      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your crops.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCrops();
  }, []); // Empty array ensures this runs only once

  // 5. Update the handleDelete function to call the API
  const handleDelete = async (e, cropId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete button
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        const token = localStorage.getItem("farmerToken");
        
        await api.delete(`/crops/${cropId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 6. Remove the crop from the state to update the UI
        setCrops(crops.filter((crop) => crop._id !== cropId));
        alert("Crop deleted successfully!");

      } catch (err) {
        alert("Failed to delete crop: " + (err.response?.data?.message || "Unknown error"));
      }
    }
  };

  const handleEdit = (e, index) => {
    e.stopPropagation(); 
    alert(`Edit feature coming soon for ${crops[index].name}`);
    // In a real app, you would navigate to an "EditCrop" page
    // or open a modal, similar to your Admin panel.
  };

  // 7. Update handleCropClick to use the API data
  const handleCropClick = (crop) => {
    // Navigate to crop details page with the crop _id
    // We pass the crop object in 'state' to avoid a re-fetch,
    // but CropDetails.jsx can also fetch if it needs to.
    navigate(`/crop/${crop._id}`, { state: { crop: crop } });
  };

  // 8. Add Loading and Error UI states
  if (loading) {
    return (
      <div className="my-crops-container">
        <h2>My Crops</h2>
        <p className="no-crops">Loading your crops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-crops-container">
        <h2>My Crops</h2>
        <p className="no-crops" style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="my-crops-container">
      <h2>My Crops</h2>

      {crops.length === 0 ? (
        <p className="no-crops">No crops added yet! <span onClick={() => navigate('/add-crop')} style={{color: '#2c7a4b', cursor: 'pointer', textDecoration: 'underline'}}>Add one now.</span></p>
      ) : (
        <div className="crops-grid">
          {crops.map((crop, index) => (
            <div 
              key={crop._id} // Use MongoDB _id
              className="crop-card"
              onClick={() => handleCropClick(crop)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={getCropImageUrl(crop)}
                alt={crop.name}
                className="crop-image"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_CROP_IMAGE;
                }}
              />
              <h3>{crop.name}</h3>
              <p>{crop.description}</p>
              <p>
                <strong>Price:</strong> ₹{crop.price}/kg
              </p>
              <p>
                <strong>Quantity:</strong> {crop.quantity} kg
              </p>
              {/* 9. Show the crop's approval status */}
              <p>
                <strong>Status:</strong> 
                <span 
                  className={`status-badge ${crop.status.toLowerCase()}`}
                  style={{
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    marginLeft: '8px',
                    background: crop.status === 'active' ? '#c6f6d5' : (crop.status === 'pending' ? '#fff3cd' : '#f8d7da'),
                    color: crop.status === 'active' ? '#22543d' : (crop.status === 'pending' ? '#856404' : '#721c24')
                  }}
                >
                  {crop.status}
                </span>
              </p>
              <div className="card-actions">
                <button className="edit-btn" onClick={(e) => handleEdit(e, index)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={(e) => handleDelete(e, crop._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCrops;
