import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/dashboard.css";

const AddCrop = () => {
  const navigate = useNavigate();
  const [cropName, setCropName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(""); // This will hold the Base64 string

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // This function converts the image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // The Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cropName || !description || !price || !quantity || !image) {
      setError("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {

      const token = localStorage.getItem("farmerToken"); 
      
      if (!token) {
        setError("You are not logged in as a farmer. Please login again.");
        setLoading(false);
        navigate('/login'); // Send to login
        return;
      }
      // ===================================================================

      // Create the data object for the API
      const newCropData = {
        cropName: cropName,
        description: description,
        price: price, 
        quantity: quantity, 
        image: image, // The Base64 string
        category: 'Other', 
        location: 'Farm Location'
      };

      // Send the POST request with the token in the headers
      await axios.post(`${API_URL}/crops`, newCropData, {
        headers: {
          Authorization: `Bearer ${token}` // This proves you are a logged-in farmer
        }
      });

      setLoading(false);
      alert("Crop added successfully! It is now live and visible to consumers.");
      navigate("/my-crops");

    } catch (err) {
      setLoading(false);
      // This will show "Only farmers can add crops" if the token is wrong
      setError(err.response?.data?.message || "Failed to add crop. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add New Crop</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <form className="add-crop-form" onSubmit={handleSubmit}>
        <label>
          Crop Name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          placeholder="Enter crop name"
        />

        <label>
          Description <span className="required">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        ></textarea>

        <label>
          Price per kg (₹) <span className="required">*</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price (e.g., 40)"
        />

        <label>
          Quantity (kg) <span className="required">*</span>
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity (e.g., 500)"
        />

        <label>
          Upload Image <span className="required">*</span>
        </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <div className="preview">
            <p>Preview:</p>
            <img src={image} alt="Crop Preview" className="preview-image" />
          </div>
        )}

        <button 
          type="submit" 
          className="btn-submit" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Crop'}
        </button>
      </form>
    </div>
  );
};

export default AddCrop;