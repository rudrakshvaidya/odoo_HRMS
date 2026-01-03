import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/signup', formData);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required 
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} 
        />
        <input type="email" placeholder="Email" required 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;