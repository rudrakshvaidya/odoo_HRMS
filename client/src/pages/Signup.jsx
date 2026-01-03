import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.post('/auth/signup', formData);
      alert('Company Registration Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering company');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        {/* Placeholder for Logo Upload based on wireframe */}
        <div style={{textAlign: 'center', background: '#e9ecef', padding: '10px', marginBottom: '20px', borderRadius: '4px', color: '#666'}}>
          App/Web Logo
        </div>

        <h2>Company Registration</h2>
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input name="companyName" type="text" onChange={handleChange} required />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>First Name</label>
              <input name="firstName" type="text" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Last Name</label>
              <input name="lastName" type="text" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" type="text" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn">Sign Up</button>
        </form>
        <Link to="/" className="link-text">Already have an account? Sign In</Link>
      </div>
    </div>
  );
};

export default Signup;