import React, { useState, useEffect } from "react"; // Added useEffect
import api from '../../api/client'; // API client
import "../../styles/Admin/OrderManagement.css";

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Remove sample data, add loading/error states
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 2. Helper function to get admin token
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // 3. Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("Admin token not found. Please login again.");
        setLoading(false);
        return;
      }

      // 4. Make authorized GET request
      const response = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.data);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Update the status handler to call the API
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      
      // 6. Send PUT request with the new status
      const response = await api.put(`/orders/${orderId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 7. Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? response.data.data : order
        )
      );
      
      // Update modal if it's open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(response.data.data);
      }
      
      alert(`Order ${orderId} status updated to ${newStatus}!`);

    } catch (err) {
      alert("Failed to update order status: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  // 8. Update cancel handler to use the new status handler
  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      handleUpdateStatus(orderId, "cancelled");
    }
  };

  // --- No changes to modal open/close logic ---

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // --- Filter logic (updated to use API fields) ---
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.farmer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.cropName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // --- No changes to helper functions ---
  const getStatusClass = (status) => {
    switch (status) {
      case "pending": return "status-pending";
      case "processing": return "status-processing";
      case "shipped": return "status-shipped";
      case "delivered": return "status-delivered";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };
  
  const getStatusIcon = (status) => { /* ... (no change) ... */ };

  // 9. Add Loading/Error states
  if (loading) {
    return <div className="order-management"><p>Loading orders...</p></div>;
  }

  if (error) {
    return <div className="order-management"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="order-management">
      {/* Header with Stats (Now dynamic) */}
      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{orders.filter((o) => o.status === "pending").length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <h3>{orders.filter((o) => o.status === "processing").length}</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <h3>{orders.filter((o) => o.status === "shipped").length}</h3>
            <p>Shipped</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{orders.filter((o) => o.status === "delivered").length}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{orders.filter((o) => o.status === "cancelled").length}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar (No changes) */}
      <div className="order-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by Order ID, Customer, Farmer, or Crop..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table (Updated to use API data) */}
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Farmer</th>
              <th>Crop</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id}</td>
                  <td>{order.customer ? order.customer.name : 'N/A'}</td>
                  <td>{order.farmer ? order.farmer.name : 'N/A'}</td>
                  <td>{order.cropName}</td>
                  <td>{order.quantity} kg</td>
                  <td className="price">₹{order.totalPrice}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      {order.status === "pending" && (
                        <button
                          className="btn-process"
                          onClick={() => handleUpdateStatus(order._id, "processing")}
                          title="Start Processing"
                        >
                          ⚙️
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button
                          className="btn-ship"
                          onClick={() => handleUpdateStatus(order._id, "shipped")}
                          title="Mark as Shipped"
                        >
                          🚚
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button
                          className="btn-deliver"
                          onClick={() => handleUpdateStatus(order._id, "delivered")}
                          title="Mark as Delivered"
                        >
                          ✅
                        </button>
                      )}
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelOrder(order._id)}
                          title="Cancel Order"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  No orders found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal (Updated to use API data) */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder._id}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {/* Order Status Timeline (No changes, driven by selectedOrder.status) */}
              <div className="order-timeline">
                {/* ... (This section works as-is) ... */}
              </div>

              {/* Order Information (Updated fields) */}
              <div className="order-details">
                <div className="details-section">
                  <h3>📦 Order Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Order ID:</span>
                    <span>{selectedOrder._id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Order Date:</span>
                    <span>{selectedOrder.orderDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expected Delivery:</span>
                    <span>{selectedOrder.deliveryDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method:</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>👤 Customer Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span>{selectedOrder.customer ? selectedOrder.customer.name : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="detail-row full-width">
                    <span className="detail-label">Delivery Address:</span>
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>🌾 Product Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Crop:</span>
                    <span>{selectedOrder.cropName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Farmer:</span>
                    <span>{selectedOrder.farmer ? selectedOrder.farmer.name : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    <span>{selectedOrder.quantity} kg</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Price:</span>
                    <span className="price">₹{selectedOrder.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions (Updated to use _id) */}
              {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                <div className="status-actions">
                  <h3>Update Order Status</h3>
                  <div className="action-buttons-group">
                    {selectedOrder.status === "pending" && (
                      <button
                        className="btn-status-update processing"
                        onClick={() => handleUpdateStatus(selectedOrder._id, "processing")}
                      >
                        ⚙️ Start Processing
                      </button>
                    )}
                    {selectedOrder.status === "processing" && (
                      <button
                        className="btn-status-update shipped"
                        onClick={() => handleUpdateStatus(selectedOrder._id, "shipped")}
                      >
                        🚚 Mark as Shipped
                      </button>
                    )}
                    {selectedOrder.status === "shipped" && (
                      <button
                        className="btn-status-update delivered"
                        onClick={() => handleUpdateStatus(selectedOrder._id, "delivered")}
                      >
                        ✅ Mark as Delivered
                      </button>
                    )}
                    <button
                      className="btn-status-update cancelled"
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                    >
                      ❌ Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
