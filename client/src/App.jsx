import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateEmployee from './pages/CreateEmployee';
import Dashboard from './pages/Dashboard'; // <--- Import this

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* <--- Add Route */}
          <Route path="/create-employee" element={<CreateEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;