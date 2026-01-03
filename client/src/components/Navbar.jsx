import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleCheckIn = async () => {
    try {
      const res = await api.put('/employees/status');
      // Update local user status to reflect change immediately
      const updatedUser = { ...user, currentStatus: res.data.status };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (refreshUser) refreshUser(updatedUser); // Update parent state
    } catch (err) {
      alert('Error updating status');
    }
  };

  const isPresent = user?.currentStatus === 'Present';

  return (
    <nav style={styles.nav}>
      {/* LEFT: Logo & Tabs */}
      <div style={styles.leftSection}>
        <div style={styles.logoBox}>Dayflow</div>
        <div style={styles.tabs}>
          <Link to="/dashboard" style={styles.activeTab}>Employees</Link>
          <Link to="/attendance" style={styles.tab}>Attendance</Link>
          <Link to="/timeoff" style={styles.tab}>Time Off</Link>
        </div>
      </div>

      {/* RIGHT: Status Dot & Avatar */}
      <div style={styles.rightSection}>
        {/* Status Toggle */}
        <div style={styles.statusContainer} onClick={toggleCheckIn} title="Click to Check In/Out">
          <span style={{ marginRight: '8px', fontSize: '0.9rem' }}>
            {isPresent ? 'Checked IN' : 'Checked OUT'}
          </span>
          <div style={{
            width: '15px', height: '15px', borderRadius: '50%',
            backgroundColor: isPresent ? '#28a745' : '#dc3545', // Green or Red
            boxShadow: '0 0 5px rgba(0,0,0,0.3)'
          }} />
        </div>

        {/* Avatar Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            style={styles.avatar} 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          
          {showDropdown && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem}>My Profile</div>
              <div style={styles.dropdownItem} onClick={handleLogout}>Log Out</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '60px', background: 'white', borderBottom: '1px solid #ddd',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px', position: 'fixed', top: 0, width: '100%', boxSizing: 'border-box', zIndex: 100
  },
  leftSection: { display: 'flex', alignItems: 'center', gap: '30px' },
  logoBox: { fontWeight: 'bold', fontSize: '1.2rem', color: '#333' },
  tabs: { display: 'flex', gap: '20px' },
  tab: { textDecoration: 'none', color: '#666', fontSize: '0.95rem' },
  activeTab: { textDecoration: 'none', color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '18px' },
  
  rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  statusContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#f8f9fa', padding: '5px 10px', borderRadius: '20px' },
  
  avatar: {
    width: '35px', height: '35px', borderRadius: '50%', background: '#6c757d', color: 'white',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'
  },
  dropdown: {
    position: 'absolute', top: '45px', right: 0, background: 'white', border: '1px solid #ddd',
    borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '150px'
  },
  dropdownItem: { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#333' }
};

export default Navbar;