import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const styles = {
    nav: { background: '#333', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, width: '100%', boxSizing: 'border-box', color: 'white', zIndex: 1000 },
    link: { color: 'white', textDecoration: 'none', marginLeft: '15px', cursor: 'pointer' },
    logoutBtn: { background: '#d9534f', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '15px' }
  };

  return (
    <nav style={styles.nav}>
      <div>
        {/* Link Logo to Dashboard if logged in, else Home */}
        <Link to={token ? "/dashboard" : "/"} style={{...styles.link, fontWeight: 'bold', fontSize: '1.2rem', marginLeft: 0}}>
          Dayflow HRMS
        </Link>
      </div>
      <div>
        {token ? (
          <>
            <span style={{marginRight: '15px'}}>Hello, {user?.firstName}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Login</Link>
            {/* Only show Public Company Registration if NOT logged in */}
            <Link to="/signup" style={styles.link}>Company Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;