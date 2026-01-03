import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../Auth.css'; // Reuse card styles

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmp(res.data);
      } catch (err) {
        alert('Failed to fetch employee details');
      }
    };
    fetchEmployee();
  }, [id]);

  if (!emp) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '50px' }}>
      <div className="card" style={{ maxWidth: '600px', position: 'relative' }}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           <div style={styles.avatar}>
             {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
           </div>
           <h2>{emp.firstName} {emp.lastName}</h2>
           <span style={styles.badge}>{emp.role}</span>
        </div>

        <div style={styles.grid}>
          <div className="form-group">
            <label>Employee ID</label>
            <input value={emp.employeeId} disabled />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={emp.email} disabled />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={emp.phoneNumber || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Department / Company</label>
            <input value={emp.companyName} disabled />
          </div>
          <div className="form-group">
            <label>Current Status</label>
            <input value={emp.currentStatus} disabled style={{color: emp.currentStatus === 'Present' ? 'green' : 'red', fontWeight: 'bold'}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backBtn: { position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1rem' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', background: '#6c757d', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 10px auto' },
  badge: { background: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', color: '#555' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }
};

export default EmployeeProfile;