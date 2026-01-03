import React, { useState } from 'react';
import api from '../api';
import '../Auth.css';

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({ 
    phoneNumber: user.phoneNumber || '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    alert("Profile Update Logic would go here! (Backend update route needed)");
    // In a real app, you would send a PUT request to /employees/me to update this
  };

  return (
    <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '50px' }}>
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>My Profile</h2>
        <form onSubmit={handleUpdate}>
           <div className="form-group">
             <label>Full Name</label>
             <input value={`${user.firstName} ${user.lastName}`} disabled style={{background: '#f9f9f9'}}/>
           </div>
           <div className="form-group">
             <label>Email</label>
             <input value={user.email} disabled style={{background: '#f9f9f9'}}/>
           </div>
           <div className="form-group">
             <label>Phone Number (Editable)</label>
             <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
           </div>
           <button className="btn" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;