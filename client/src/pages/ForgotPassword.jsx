import { useState } from 'react';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Error sending email');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" required 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;