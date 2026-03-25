// src/pages/CropDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/client'; // API client
import "../styles/CropDetails.css";
import { FALLBACK_CROP_IMAGE, getCropImageUrl } from "../utils/cropImage";

const CropDetails = () => {
  const { id } = useParams(); // Get the crop ID from the URL
  const navigate = useNavigate();
  
  // 1. Add loading/error states and remove localStorage dependency
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [quantity, setQuantity] = useState(1);
  
  // 2. Fetch the specific crop data from the API on mount
  useEffect(() => {
    const fetchCrop = async () => {
      setLoading(true);
      setError("");
      try {
        // 3. Make the API call to /api/crops/:id
        const response = await api.get(`/crops/${id}`);
        setCrop(response.data.data); // Save the single crop object
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch crop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [id]); // Re-run this effect if the ID in the URL changes

  // 4. Update handleAddToCart
  // This still saves to localStorage because Cart.jsx isn't converted yet.
  // But it uses the API-fetched 'crop' object.
  const handleAddToCart = () => {
    if (!crop) return;

    // Use MongoDB _id and API data
    const cartItem = {
      _id: crop._id,
      cropName: crop.name,
      description: crop.description,
      price: parseFloat(crop.price), // Convert string price to number
      quantity: quantity,
      totalPrice: parseFloat(crop.price) * quantity,
      image: crop.image,
      farmer: crop.farmer._id // Store farmer ID
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if item is already in cart using _id
    const existingItemIndex = existingCart.findIndex(
      (item) => item._id === crop._id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].totalPrice =
        existingCart[existingItemIndex].quantity * existingCart[existingItemIndex].price;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`${crop.name} added to cart!`);
    navigate('/cart'); // Navigate to cart after adding
  };

  const handleGoBack = () => {
    // Simplified the goBack logic
    navigate("/consumer-dashboard");
  };

  // 5. Add loading and error UI states
  if (loading) {
    return (
      <div className="crop-details-page">
        <div className="not-found">
          <h2>Loading Crop Details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crop-details-page">
        <div className="not-found">
          <h2 style={{ color: 'red' }}>Error: {error}</h2>
          <button className="back-btn" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="crop-details-page">
        <div className="not-found">
          <h2>Crop not found</h2>
          <button className="back-btn" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    );
  }

  // 6. Update the JSX to use the API data structure
  const cropQuantity = parseInt(crop.quantity, 10);
  const cropPrice = parseFloat(crop.price);

  return (
    <div className="crop-details-page">
      <div className="crop-details-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Back to Crops
        </button>
      </div>

      <div className="crop-details-container">
        <div className="crop-details-content">
          <div className="crop-image-section">
            <img
              src={getCropImageUrl(crop)}
              alt={crop.name}
              className="crop-detail-image"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_CROP_IMAGE;
              }}
            />
          </div>

          <div className="crop-info-section">
            <h1 className="crop-title">{crop.name}</h1>
            
            <div className="crop-meta">
              <span className="crop-date">
                Grown by: <strong>{crop.farmer.name}</strong> from <strong>{crop.farmer.location}</strong>
              </span>
            </div>
            
            <p style={{ color: '#666' }}>{crop.description}</p>

            <div className="crop-details-grid">
              <div className="detail-item">
                <span className="detail-label">Price per kg</span>
                <span className="detail-value price">₹{cropPrice.toFixed(2)}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Available Quantity</span>
                <span className="detail-value">{cropQuantity} kg</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Total Value</span>
                <span className="detail-value">₹{(cropPrice * cropQuantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Select Quantity (kg):</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={cropQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(cropQuantity, Math.max(1, Number(e.target.value))))}
                    className="qty-input"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(cropQuantity, quantity + 1))}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-price-box">
                <span className="total-label">Total Amount:</span>
                <span className="total-amount">₹{(cropPrice * quantity).toFixed(2)}</span>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
