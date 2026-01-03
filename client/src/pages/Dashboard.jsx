import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css'; // Reuse existing styles

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is logged in, redirect to login
  if (!user) {
    window.location.href = '/'; 
    return null;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Welcome, {user.firstName} {user.lastName}</h1>
      <p style={{ color: '#666' }}>Role: <strong>{user.role}</strong> | Company: <strong>{user.companyName}</strong></p>
      
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: My Profile (Visible to Everyone) */}
        <div className="card" style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <h3>👤 My Profile</h3>
          <p>View personal details</p>
        </div>

        {/* Card 2: Attendance (Visible to Everyone) */}
        <div className="card" style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <h3>📅 Attendance</h3>
          <p>Check in / Check out</p>
        </div>

        {/* ADMIN/HR ONLY SECTION */}
        {(user.role === 'Admin' || user.role === 'HR') && (
          <div 
            className="card" 
            style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '2px dashed #007bff' }}
            onClick={() => navigate('/create-employee')}
          >
            <h3 style={{ color: '#007bff' }}>+ Add Employee</h3>
            <p>Register a new user</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;