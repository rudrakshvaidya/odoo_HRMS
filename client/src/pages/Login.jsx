import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      onLogin(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />
        <button type="submit">Login</button>
      </form>
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
    </div>
  );
};

export default Login;