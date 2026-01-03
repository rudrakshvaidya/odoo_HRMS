// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}><strong>MyApp</strong></Link>
      
      {isAuthenticated ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;