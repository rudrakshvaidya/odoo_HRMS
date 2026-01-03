import React, { useState, useEffect } from 'react'; // <--- Add useEffect
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

const Login = ({ refreshUser }) => { // Ensure refreshUser is receiving props
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // FIX: Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      refreshUser(res.data.user); // Updates the Navbar immediately
      navigate('/dashboard');     // Sends you to the dashboard
    } catch (err) {
      // Show the REAL error message from the backend
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2>Dayflow Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
        <Link to="/signup" className="link-text">New Employee? Register Here</Link>
      </div>
    </div>
  );
};

export default Login;