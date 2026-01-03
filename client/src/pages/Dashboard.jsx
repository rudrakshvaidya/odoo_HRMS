import { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user");
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.fullname}</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user._id}</p>
    </div>
  );
};

export default Dashboard;