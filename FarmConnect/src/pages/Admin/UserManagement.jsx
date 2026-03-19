import React, { useState, useEffect } from 'react';
import api from '../../api/client'; // API client
import '../../styles/Admin/UserManagement.css';

const UserManagement = () => {
  // 1. Remove the hard-coded sample data
  const [users, setUsers] = useState([]);
  
  // 2. Add new state for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'

  // 4. Function to get the token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // 5. Fetch users from the backend when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('No authorization token found. Please login again.');
        setLoading(false);
        return;
      }

      // 6. Make an authorized API call
      const response = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // The backend 'User' model uses 'role', but your frontend UI uses 'type'.
      // We must map 'role' to 'type' when we receive it.
      const usersWithUiType = response.data.data.map(user => ({
        ...user,
        type: user.role // Map 'role' from DB to 'type' for the UI
      }));
      setUsers(usersWithUiType); // Set users from the API response
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Update the Delete handler
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = getToken();
        await api.delete(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh the user list after deleting
        setUsers(users.filter(user => user._id !== userId)); // Use _id from MongoDB

      } catch (err) {
        alert('Failed to delete user: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  // 8. Update the Save handler
  const handleSaveUser = async () => {
    try {
      const token = getToken();
      
      // The modal state uses 'type', which is what the frontend needs.
      // The backend API controller expects 'type' as well.
      const updatedData = {
        ...selectedUser,
        // 'type' is already 'Farmer' or 'Consumer' in your state, which is what the controller expects
      };
      
      const response = await api.put(`/users/${selectedUser._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Map 'role' to 'type' for the updated user
      const savedUser = {
        ...response.data.data,
        type: response.data.data.role
      };

      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === selectedUser._id ? savedUser : user
      ));
      
      setShowModal(false);
      setSelectedUser(null);

    } catch (err) {
      alert('Failed to update user: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  // --- No changes needed below this line for API connection ---
  // --- (except for mapping .id to ._id in a few places) ---

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setModalMode('edit');
    setShowModal(true);
  };

  // Handle modal input change
  const handleInputChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value
    });
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // --- 9. Add Loading/Error states to the render method ---
  if (loading) {
    return <div className="user-management"><p>Loading users...</p></div>;
  }

  if (error) {
    return <div className="user-management"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="user-management">
      <div className="um-header">
        <h2 className="um-title">User Management</h2>
        <p className="um-subtitle">Manage all farmers and consumers</p>
      </div>

      {/* Filters and Search (No changes) */}
      <div className="um-controls">
        <div className="um-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="um-filters">
          <button
            className={`filter-btn ${filterType === 'All' ? 'active' : ''}`}
            onClick={() => setFilterType('All')}
          >
            All Users ({users.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'Farmer' ? 'active' : ''}`}
            onClick={() => setFilterType('Farmer')}
          >
            🌾 Farmers ({users.filter(u => u.type === 'Farmer').length})
          </button>
          <button
            className={`filter-btn ${filterType === 'Consumer' ? 'active' : ''}`}
            onClick={() => setFilterType('Consumer')}
          >
            🛒 Consumers ({users.filter(u => u.type === 'Consumer').length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                // Use user._id from MongoDB as the key
                <tr key={user._id}> 
                  <td>{user._id}</td>
                  <td>
                    <div className="user-name-cell">
                      <span className="user-avatar">{user.name.charAt(0)}</span>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`type-badge ${user.type.toLowerCase()}`}>
                      {user.type === 'Farmer' ? '🌾' : '🛒'} {user.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  {/* Format the date from MongoDB */}
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewUser(user)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No users found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for View/Edit (Modal render logic is unchanged) */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'view' ? 'User Details' : 'Edit User'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                {modalMode === 'view' ? (
                  <p className="form-value">{selectedUser.name}</p>
                ) : (
                  <input
                    type="text"
                    name="name"
                    value={selectedUser.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                {modalMode === 'view' ? (
                  <p className="form-value">{selectedUser.email}</p>
                ) : (
                  <input
                    type="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                {modalMode === 'view' ? (
                  <p className="form-value">{selectedUser.phone || 'N/A'}</p>
                ) : (
                  <input
                    type="tel"
                    name="phone"
                    value={selectedUser.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                )}
              </div>

              <div className="form-group">
                <label>User Type</label>
                {modalMode === 'view' ? (
                  <p className="form-value">
                    <span className={`type-badge ${selectedUser.type.toLowerCase()}`}>
                      {selectedUser.type === 'Farmer' ? '🌾' : '🛒'} {selectedUser.type}
                    </span>
                  </p>
                ) : (
                  <select
                    name="type"
                    value={selectedUser.type}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Consumer">Consumer</option>
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Status</label>
                {modalMode === 'view' ? (
                  <p className="form-value">
                    <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status}
                    </span>
                  </p>
                ) : (
                  <select
                    name="status"
                    value={selectedUser.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Join Date</label>
                <p className="form-value">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="modal-footer">
              {modalMode === 'edit' && (
                <button className="save-btn" onClick={handleSaveUser}>
                  💾 Save Changes
                </button>
              )}
              <button className="cancel-btn" onClick={closeModal}>
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
