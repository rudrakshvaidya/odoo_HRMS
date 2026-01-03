import React, { useEffect, useState } from 'react';
import api from '../api';
import '../Auth.css';

const TimeOff = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user.role === 'Admin' || user.role === 'HR';
  
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    leaveType: 'Paid Time Off',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/timeoff');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/timeoff/request', formData);
      setShowModal(false);
      fetchRequests(); // Refresh table
      setFormData({ leaveType: 'Paid Time Off', startDate: '', endDate: '', reason: '' }); // Reset
    } catch (err) {
      alert('Failed to submit request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/timeoff/${id}/status`, { status });
      fetchRequests(); // Refresh UI instantly
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION - Matches Wireframe */}
      <div style={{borderBottom: '2px solid #333', marginBottom: '20px', paddingBottom: '10px'}}>
         <h2 style={{margin:0, background: '#ffcccb', display: 'inline-block', padding: '5px 15px', border: '1px solid #333'}}>Time Off</h2>
      </div>

      {/* ACTION BAR & STATS */}
      <div style={{marginBottom: '20px'}}>
        {/* NEW Button (Purple) */}
        {!isAdmin && (
           <button 
             onClick={() => setShowModal(true)}
             style={{background: '#d05ce3', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', marginRight: '20px'}}
           >
             NEW
           </button>
        )}

        {/* Balance Cards - Visual Match for Wireframe */}
        <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', borderBottom: '2px solid #333', padding: '15px 0', marginTop: '10px'}}>
           <div style={{textAlign: 'center', flex: 1, borderRight: '1px solid #ccc'}}>
              <h4 style={{color: '#007bff', margin: 0}}>Paid time Off</h4>
              <p style={{margin: '5px 0'}}>24 Days Available</p>
           </div>
           <div style={{textAlign: 'center', flex: 1}}>
              <h4 style={{color: '#007bff', margin: 0}}>Sick time off</h4>
              <p style={{margin: '5px 0'}}>07 Days Available</p>
           </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd'}}>
        <thead>
          <tr style={{background: '#f8f9fa', textAlign: 'left'}}>
            <th style={{padding: '10px', borderBottom: '2px solid #333'}}>Name</th>
            <th style={{padding: '10px', borderBottom: '2px solid #333'}}>Start Date</th>
            <th style={{padding: '10px', borderBottom: '2px solid #333'}}>End Date</th>
            <th style={{padding: '10px', borderBottom: '2px solid #333'}}>Time off Type</th>
            <th style={{padding: '10px', borderBottom: '2px solid #333'}}>Status</th>
            {isAdmin && <th style={{padding: '10px', borderBottom: '2px solid #333'}}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '10px'}}>
                {isAdmin ? `${req.User?.firstName} ${req.User?.lastName}` : 'You'}
              </td>
              <td style={{padding: '10px'}}>{req.startDate}</td>
              <td style={{padding: '10px'}}>{req.endDate}</td>
              <td style={{padding: '10px', color: '#007bff'}}>{req.leaveType}</td>
              <td style={{padding: '10px'}}>
                 <span style={{
                   padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                   background: req.status === 'Approved' ? '#d4edda' : req.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                   color: req.status === 'Approved' ? '#155724' : req.status === 'Rejected' ? '#721c24' : '#856404'
                 }}>
                   {req.status}
                 </span>
              </td>
              {isAdmin && (
                <td style={{padding: '10px'}}>
                  {req.status === 'Pending' && (
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button 
                        onClick={() => handleStatusUpdate(req.id, 'Approved')}
                        style={{background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                      >
                        ✓
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                         style={{background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL POPUP - Matches Wireframe Note */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="card" style={{width: '400px', padding: '20px'}}>
             <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0}}>Time off Type Request</h3>
             <form onSubmit={handleSubmit}>
                <div className="form-group">
                   <label>Time off Type</label>
                   <select 
                     style={{width: '100%', padding: '8px'}}
                     value={formData.leaveType}
                     onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                   >
                     <option>Paid Time Off</option>
                     <option>Sick Leave</option>
                     <option>Unpaid Leave</option>
                   </select>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                   <div className="form-group" style={{flex: 1}}>
                      <label>Start Date</label>
                      <input type="date" required onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                   </div>
                   <div className="form-group" style={{flex: 1}}>
                      <label>End Date</label>
                      <input type="date" required onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                   </div>
                </div>
                <div className="form-group">
                   <label>Reason (Optional)</label>
                   <input type="text" onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                </div>
                
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                   <button type="submit" className="btn" style={{background: '#d05ce3'}}>Submit</button>
                   <button type="button" className="btn" style={{background: '#6c757d'}} onClick={() => setShowModal(false)}>Discard</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOff;