import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

const Signup = () => {
  // Added employeeId and role to state
  const [formData, setFormData] = useState({ 
    fullname: '', 
    employeeId: '', 
    email: '', 
    password: '', 
    role: 'Employee' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Dayflow Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" onChange={(e) => setFormData({...formData, fullname: e.target.value})} required />
          </div>

          {/* New Field: Employee ID */}
          <div className="form-group">
            <label>Employee ID</label>
            <input type="text" placeholder="e.g. EMP001" onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>

          {/* New Field: Role Selection */}
          <div className="form-group">
            <label>Role</label>
            <select 
              style={{width: '100%', padding: '8px', marginTop: '5px'}}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              value={formData.role}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn">Sign Up</button>
        </form>
        <Link to="/login" className="link-text">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;