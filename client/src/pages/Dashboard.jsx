import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Safe check to avoid crash if localstorage is empty
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // Fetch employees on load
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };
    fetchEmployees();
  }, []);

  // Filter logic: Matches Search Term AND Role is 'Employee'
  const filteredEmployees = employees.filter(emp => {
    const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const isEmployee = emp.role === 'Employee'; // <--- Only show Employees
    
    return matchesSearch && isEmployee;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Bar: New Button & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        
        {/* Only Admin or HR can see the 'NEW' button */}
        {(currentUser.role === 'Admin' || currentUser.role === 'HR') ? (
          <button 
            onClick={() => navigate('/create-employee')}
            style={{ background: '#7e57c2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            NEW
          </button>
        ) : (
          <div></div> /* Empty div to keep search bar on the right if button is hidden */
        )}
        
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Employee Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(emp => (
            <div 
              key={emp.id} 
              className="employee-card" 
              style={styles.card}
              onClick={() => navigate(`/employee/${emp.id}`)}
            >
              {/* Status Icon (Top Right) */}
              <div style={styles.statusIcon} title={emp.currentStatus}>
                {emp.currentStatus === 'Present' ? '🟢' : 
                 emp.currentStatus === 'On Leave' ? '✈️' : '🟡'}
              </div>

              {/* Avatar & Info */}
              <div style={styles.cardContent}>
                <div style={styles.largeAvatar}>
                  {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                </div>
                <h3 style={{ margin: '10px 0 5px 0' }}>{emp.firstName} {emp.lastName}</h3>
                <p style={{ color: '#666', margin: 0 }}>{emp.role}</p>
                <p style={{ color: '#888', fontSize: '0.8rem' }}>{emp.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', colSpan: 3 }}>No employees found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0',
    position: 'relative', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s', cursor: 'pointer'
  },
  statusIcon: { position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' },
  cardContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  largeAvatar: {
    width: '80px', height: '80px', borderRadius: '50%', background: '#e9ecef', color: '#495057',
    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold'
  }
};

export default Dashboard;