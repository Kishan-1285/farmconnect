// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 1. Add loading and error states for checkout
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the API URL
  const API_URL = import.meta.env.VITE_API_URL;

  // This logic remains the same - it reads from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  // All this logic also remains the same
  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    updatedCart[index].totalPrice = updatedCart[index].price * newQuantity;
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice || item.price * item.quantity), 0);
  };

  const handleBack = () => {
    navigate("/consumer-dashboard");
  };

  // 2. This is the main function we are updating
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 3. Get the consumer's token
      const token = localStorage.getItem("consumerToken");
      if (!token) {
        setError("You must be logged in to check out.");
        setLoading(false);
        navigate('/login');
        return;
      }

      // 4. Create the order payload for the API
      const orderData = {
        cartItems: cartItems,
        deliveryAddress: "123 Farm Connect Lane, Coimbatore, TN",
        paymentMethod: "Online Payment",
        phone: "+91 7806877949"
      };

      // 5. Create order first
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const orderId = response.data.data[0]._id;
      const totalAmount = calculateTotal();

      setLoading(false);

      // 6. Redirect to payment gateway
      // Store order details for payment
      localStorage.setItem("pendingOrder", JSON.stringify({
        orderId,
        totalAmount,
        cartItems
      }));

      navigate("/payment", { state: { orderId, totalAmount } });

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    }
  };

  // --- No changes to the JSX structure ---
  // --- We just add loading/error messages ---

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🛒</div>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>Add some fresh crops to your cart!</p>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: "#2c7a4b",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          ← Browse Crops
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", minHeight: "100vh", background: "#f5f7fa" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "30px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: "#2c7a4b", margin: 0 }}>🛒 Your Cart ({cartItems.length} items)</h2>
          <button
            onClick={() => {
              if (window.confirm("Clear all items from cart?")) {
                setCartItems([]);
                localStorage.setItem("cart", JSON.stringify([]));
              }
            }}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Clear Cart
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  background: "white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  display: "grid",
                  gridTemplateColumns: "150px 1fr auto",
                  gap: "20px",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(index)}
                  title="Remove from cart"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    hover: {
                      backgroundColor: "#dc3545",
                      color: "white"
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.color = "#666";
                  }}
                >
                  🗑️
                </button>

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.cropName}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                {/* Details */}
                <div>
                  <h3 style={{ color: "#2c7a4b", margin: "0 0 10px 0" }}>{item.cropName}</h3>
                  <p style={{ color: "#666", margin: "5px 0" }}>{item.description}</p>
                  <p style={{ color: "#333", fontWeight: "600", margin: "5px 0" }}>
                    ₹{item.price}/kg
                  </p>
                </div>

                {/* Quantity controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>Quantity</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      style={{
                        backgroundColor: "#2c7a4b",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                      style={{
                        width: "60px",
                        textAlign: "center",
                        padding: "8px",
                        border: "2px solid #ddd",
                        borderRadius: "5px",
                        fontWeight: "600",
                      }}
                      min="1"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                      style={{
                        backgroundColor: "#2c7a4b",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "#2c7a4b", fontWeight: "700", fontSize: "18px" }}>
                    ₹{item.totalPrice || item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "fit-content",
            position: "sticky",
            top: "20px",
          }}>
            <h3 style={{ color: "#2c7a4b", marginTop: 0 }}>Order Summary</h3>
            
            <div style={{ borderTop: "2px solid #e9ecef", paddingTop: "15px", marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: "600" }}>₹{calculateTotal()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <span>Delivery:</span>
                <span style={{ color: "#28a745", fontWeight: "600" }}>FREE</span>
              </div>
              <div style={{ borderTop: "2px solid #e9ecef", paddingTop: "15px", marginTop: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "700", color: "#2c7a4b" }}>
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
            
            {/* 7. Show API errors here */}
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

            {/* 8. Disable button when loading */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#ccc" : "#2c7a4b",
                color: "white",
                padding: "15px",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "700",
                marginTop: "20px",
              }}
            >
              {loading ? 'Placing Order...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={handleBack}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#2c7a4b",
                padding: "12px",
                border: "2px solid #2c7a4b",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}