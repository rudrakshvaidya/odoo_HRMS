import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL
  
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reset-password', { token, newPassword });
      alert('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      alert('Error resetting password');
    }
  };

  if (!token) return <p>Invalid or missing token.</p>;

  return (
    <div>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New Password" required 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;