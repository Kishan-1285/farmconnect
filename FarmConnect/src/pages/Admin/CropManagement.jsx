import React, { useState, useEffect } from "react";
import api from '../../api/client'; // API client
import "../../styles/Admin/CropManagement.css";
import { FALLBACK_CROP_IMAGE, getCropImageUrl } from "../../utils/cropImage";

export default function CropManagement() {
  // 1. Remove sample data, add loading/error states
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view' or 'edit'

  // 2. Helper function to get the token
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // 3. Fetch all crops when the component mounts
  useEffect(() => {
    fetchAllCrops();
  }, []);

  const fetchAllCrops = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("Admin token not found. Please login again.");
        setLoading(false);
        return;
      }

      // 4. Call the admin-specific endpoint
      const response = await api.get('/crops/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCrops(response.data.data);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch crops.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Update crop status (Approve/Reject)
  const handleUpdateStatus = async (cropId, newStatus) => {
    try {
      const token = getToken();
      
      // Send a PUT request with only the new status
      await api.put(`/crops/${cropId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 6. Update the local state to reflect the change
      setCrops(
        crops.map((crop) =>
          crop._id === cropId ? { ...crop, status: newStatus } : crop
        )
      );
      alert(`Crop status updated to ${newStatus}!`);

    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  // 7. Update Delete handler
  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        const token = getToken();
        await api.delete(`/crops/${cropId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 8. Remove from local state
        setCrops(crops.filter((crop) => crop._id !== cropId));
        alert("Crop deleted successfully!");
        
      } catch (err) {
        alert("Failed to delete crop: " + (err.response?.data?.message || "Unknown error"));
      }
    }
  };

  // 9. Update Save Edit handler
  const handleSaveEdit = async () => {
    try {
      const token = getToken();
      
      const response = await api.put(`/crops/${selectedCrop._id}`, selectedCrop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 10. Update the crop in the local state
      setCrops(
        crops.map((crop) =>
          crop._id === selectedCrop._id ? response.data.data : crop
        )
      );
      setIsModalOpen(false);
      alert("Crop updated successfully!");
      
    } catch (err) {
      alert("Failed to save changes: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  // --- No changes needed to modal open/close logic ---

  const handleView = (crop) => {
    setSelectedCrop(crop);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (crop) => {
    setSelectedCrop({ ...crop });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrop(null);
  };

  // --- No changes needed to filter logic ---

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.farmer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      filterStatus === "all" || crop.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || crop.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "active": return "status-active";
      case "pending": return "status-pending";
      case "inactive": return "status-inactive";
      default: return "";
    }
  };

  // 11. Add Loading/Error states
  if (loading) {
    return <div className="crop-management"><p>Loading crops...</p></div>;
  }

  if (error) {
    return <div className="crop-management"><p style={{ color: 'red' }}>{error}</p></div>;
  }
  
  return (
    <div className="crop-management">
      {/* Header with Stats (Still using filtered local data, which is fine) */}
      <div className="crop-stats">
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-info">
            <h3>{crops.length}</h3>
            <p>Total Crops</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{crops.filter((c) => c.status === "active").length}</h3>
            <p>Active Crops</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{crops.filter((c) => c.status === "pending").length}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{crops.filter((c) => c.status === "inactive").length}</h3>
            <p>Inactive Crops</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar (No changes) */}
      <div className="crop-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search crops, farmer, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Crops Table (Updated to use API data) */}
      <div className="crop-table-container">
        <table className="crop-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Farmer</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.length > 0 ? (
              filteredCrops.map((crop) => (
                <tr key={crop._id}>
                  <td>
                    <div className="crop-info">
                      {/* Use a default emoji or crop.image if it's an emoji */}
                      <span className="crop-icon">
                        {crop.image && crop.image.startsWith("data:") ? "🖼️" : "🌾"}
                      </span>
                      <span>{crop.name}</span>
                    </div>
                  </td>
                  {/* Handle case where farmer might be deleted */}
                  <td>{crop.farmer ? crop.farmer.name : 'N/A'}</td>
                  <td>{crop.category || 'N/A'}</td>
                  <td>{crop.quantity} kg</td>
                  <td className="price">₹{crop.price}/kg</td>
                  <td>{crop.location || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(crop.status)}`}>
                      {crop.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleView(crop)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(crop)}
                        title="Edit Crop"
                      >
                        ✏️
                      </button>
                      {crop.status === "pending" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleUpdateStatus(crop._id, "active")}
                            title="Approve Crop"
                          >
                            ✅
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleUpdateStatus(crop._id, "inactive")}
                            title="Reject Crop"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(crop._id)}
                        title="Delete Crop"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No crops found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for View/Edit (Updated to use API data) */}
      {isModalOpen && selectedCrop && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "view" ? "Crop Details" : "Edit Crop"}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {modalMode === "view" ? (
                // View Mode
                <div className="crop-details">
                  <div className="detail-row">
                    <span className="detail-label">Crop Image:</span>
                    <img
                      src={getCropImageUrl(selectedCrop)}
                      alt={selectedCrop.name}
                      style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_CROP_IMAGE;
                      }}
                    />
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Crop Name:</span>
                    <span>{selectedCrop.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Farmer:</span>
                    <span>{selectedCrop.farmer ? selectedCrop.farmer.name : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span>{selectedCrop.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    <span>{selectedCrop.quantity} kg</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Price:</span>
                    <span className="price">₹{selectedCrop.price}/kg</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span>{selectedCrop.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Harvest Date:</span>
                    <span>{selectedCrop.harvestDate ? new Date(selectedCrop.harvestDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${getStatusClass(selectedCrop.status)}`}>
                      {selectedCrop.status}
                    </span>
                  </div>
                  <div className="detail-row full-width">
                    <span className="detail-label">Description:</span>
                    <p>{selectedCrop.description}</p>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="crop-form">
                  <div className="form-group">
                    <label>Crop Name:</label>
                    <input
                      type="text"
                      value={selectedCrop.name}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      value={selectedCrop.category}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, category: e.target.value })
                      }
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity (kg):</label>
                    <input
                      type="text"
                      value={selectedCrop.quantity}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹/kg):</label>
                    <input
                      type="text"
                      value={selectedCrop.price}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={selectedCrop.location}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Harvest Date:</label>
                    <input
                      type="date"
                      value={selectedCrop.harvestDate}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, harvestDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={selectedCrop.status}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Description:</label>
                    <textarea
                      value={selectedCrop.description}
                      onChange={(e) =>
                        setSelectedCrop({ ...selectedCrop, description: e.target.value })
                      }
                      rows="3"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {modalMode === "edit" && (
                <button className="btn-save" onClick={handleSaveEdit}>
                  💾 Save Changes
                </button>
              )}
              <button className="btn-cancel" onClick={closeModal}>
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
