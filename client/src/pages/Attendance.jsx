import React, { useEffect, useState } from 'react';
import api from '../api';
import '../Auth.css';

const AttendancePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user.role === 'Admin' || user.role === 'HR';

  // State
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today

  useEffect(() => {
    if (isAdmin) {
      fetchAdminView();
    } else {
      fetchEmployeeView();
    }
  }, [selectedDate]); // Re-fetch when date changes (for admin)

  // Fetch Logic
  const fetchEmployeeView = async () => {
    const res = await api.get('/attendance/my-history');
    setLogs(res.data);
  };

  const fetchAdminView = async () => {
    const res = await api.get(`/attendance/daily-log?date=${selectedDate}`);
    setLogs(res.data);
  };

  // Helper to calculate Extra Hours (Assuming 9 hour shift)
  const getExtraHours = (hours) => {
    const extra = hours - 9;
    return extra > 0 ? extra.toFixed(2) : '0.00';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- HEADER --- */}
      <h1 style={{ marginBottom: '20px' }}>
        {isAdmin ? 'Daily Attendance Log' : 'My Attendance History'}
      </h1>

      {/* --- ADMIN CONTROLS --- */}
      {isAdmin && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '15px', borderRadius: '8px' }}>
           <label><strong>Select Date:</strong></label>
           <input 
             type="date" 
             value={selectedDate} 
             onChange={(e) => setSelectedDate(e.target.value)}
             style={{ padding: '8px' }}
           />
           <span style={{color: '#666', fontSize: '0.9rem', marginLeft: 'auto'}}>Viewing records for: {selectedDate}</span>
        </div>
      )}

      {/* --- EMPLOYEE STATS (Only for Employee) --- */}
      {!isAdmin && (
         <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="card" style={{flex:1, textAlign:'center', background:'#e3f2fd'}}>
               <h3>{logs.length}</h3>
               <p>Days Present</p>
            </div>
            <div className="card" style={{flex:1, textAlign:'center', background:'#fce4ec'}}>
               <h3>0</h3>
               <p>Leaves Taken</p>
            </div>
            <div className="card" style={{flex:1, textAlign:'center', background:'#e8f5e9'}}>
               <h3>22</h3>
               <p>Working Days</p>
            </div>
         </div>
      )}

      {/* --- TABLE VIEW --- */}
      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>{isAdmin ? 'Employee Name' : 'Date'}</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Check In</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Check Out</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Work Hours</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Extra Hours</th>
              {isAdmin && <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>}
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                  {/* Column 1: Date (Emp) OR Name (Admin) */}
                  <td style={{ padding: '15px' }}>
                    {isAdmin ? (
                      <div>
                        <strong>{log.User?.firstName} {log.User?.lastName}</strong><br/>
                        <span style={{fontSize:'0.8rem', color:'#666'}}>{log.User?.employeeId}</span>
                      </div>
                    ) : log.date}
                  </td>
                  
                  <td style={{ padding: '15px' }}>{log.checkInTime}</td>
                  <td style={{ padding: '15px' }}>{log.checkOutTime || '-'}</td>
                  <td style={{ padding: '15px' }}>{log.workHours} hrs</td>
                  <td style={{ padding: '15px', color: getExtraHours(log.workHours) > 0 ? 'green' : 'inherit' }}>
                    {getExtraHours(log.workHours)}
                  </td>
                  
                  {isAdmin && (
                     <td style={{ padding: '15px' }}>
                        <span style={{
                           background: log.status === 'Present' ? '#d4edda' : '#f8d7da',
                           color: log.status === 'Present' ? '#155724' : '#721c24',
                           padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem'
                        }}>
                           {log.status}
                        </span>
                     </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                  No attendance records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;