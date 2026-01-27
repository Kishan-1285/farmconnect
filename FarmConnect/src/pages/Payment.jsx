import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/dashboard.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { orderId, totalAmount } = location.state || {};

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!totalAmount) {
      setError('Invalid payment amount');
      return;
    }

    setLoading(true);

    const options = {
      key: 'rzp_test_1DP5MMOk78YrWA', // Razorpay Test Key (replace with your live key)
      amount: totalAmount * 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      name: 'Farm Connect',
      description: `Order Payment - ${orderId}`,
      order_id: orderId,
      handler: function (response) {
        // Payment successful
        setLoading(false);
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('pendingOrder');
        
        // Navigate to success page
        navigate('/consumer-dashboard', { 
          state: { message: 'Order placed successfully!' } 
        });
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#2c7a4b',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError('Payment cancelled. Please try again.');
        },
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setLoading(false);
      setError('Payment gateway not loaded. Please try again.');
    }
  };

  if (!totalAmount) {
    return (
      <div className="dashboard-container">
        <h2>Payment</h2>
        <p style={{ color: 'red', textAlign: 'center' }}>Error: Invalid payment details. Please try again.</p>
        <button 
          onClick={() => navigate('/cart')}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '10px 20px',
            backgroundColor: '#2c7a4b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '30px 20px',
      background: '#f5f7fa',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#2c7a4b', marginBottom: '30px' }}>💳 Payment Gateway</h2>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Order ID
          </label>
          <input 
            type="text" 
            value={orderId} 
            disabled 
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Amount to Pay
          </label>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2c7a4b',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '6px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <div style={{ borderBottom: '2px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c7a4b' }}>� Google Pay (GPay)</h3>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#2c7a4b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : '📱 Pay with Google Pay'}
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
            Fast & Secure Payment
          </p>
        </div>

        <div style={{ paddingTop: '20px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c7a4b' }}>📱 UPI Payment</h3>
          <div style={{
            border: '2px solid #2c7a4b',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Scan with any UPI app</p>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'inline-block'
            }}>
              <p style={{ fontSize: '12px', color: '#333', fontWeight: '600' }}>UPI ID</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c7a4b', margin: '5px 0' }}>
                2005r.kishan@oksbi
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('2005r.kishan@oksbi');
                  alert('UPI ID copied!');
                }}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#e8f5e9',
                  color: '#2c7a4b',
                  border: '1px solid #2c7a4b',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📋 Copy UPI ID
              </button>
            </div>

            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ fontSize: '12px', color: '#333', fontWeight: '600' }}>Or call to complete payment</p>
              <a 
                href="tel:7806877949"
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2c7a4b',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                📞 7806877949
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('7806877949');
                  alert('Phone number copied!');
                }}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#e8f5e9',
                  color: '#2c7a4b',
                  border: '1px solid #2c7a4b',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📋 Copy Number
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/cart')}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#2c7a4b',
            border: '2px solid #2c7a4b',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          ← Back to Cart
        </button>
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#666',
        marginTop: '20px',
        marginBottom: '30px'
      }}>
        <p>🔒 Your payment information is secure</p>
      </div>
      </div>
    </div>
  );
};

export default Payment;
