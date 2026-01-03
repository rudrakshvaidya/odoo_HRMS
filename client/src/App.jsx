import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEmployee from './pages/CreateEmployee';

function App() {
  // Lift user state up so Navbar can access it
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Helper to update user state from child components
  const refreshUser = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      {/* Show Navbar only if logged in */}
      {user && <Navbar user={user} refreshUser={refreshUser} />}
      
      <div style={{ paddingTop: user ? '80px' : '0' }}>
        <Routes>
          <Route path="/" element={<Login refreshUser={refreshUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;