import React, { useEffect, useState } from 'react';
import api from '../api';
import '../Auth.css';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' or 'salary'
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    aboutMe: '',
    location: '',
    phoneNumber: '',
    skills: '' // Comma separated string for simplicity
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Fetch "Me" (using the ID from local storage)
      const res = await api.get(`/employees/${currentUser.id}`);
      setUser(res.data);
      setFormData({
        aboutMe: res.data.aboutMe || '',
        location: res.data.location || '',
        phoneNumber: res.data.phoneNumber || '',
        skills: res.data.skills ? JSON.parse(res.data.skills).join(', ') : ''
      });
    } catch (err) {
      alert('Error loading profile');
    }
  };

  const handleSave = async () => {
    try {
      // Convert skills string back to array
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      
      await api.put(`/employees/${currentUser.id}`, {
        ...formData,
        skills: JSON.stringify(skillsArray) // Send as JSON string
      });
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (err) {
      alert('Error saving profile');
    }
  };

  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '20px' }}>
      <div className="card" style={{ maxWidth: '900px', width: '100%', padding: '0' }}>
        
        {/* === HEADER SECTION === */}
        <div style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', gap: '30px', alignItems: 'center' }}>
          {/* Avatar Circle */}
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', background: '#ffcccb', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', border: '2px solid #333'
          }}>
             ✏️
          </div>
          
          {/* Header Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h1>
            <p style={{ color: '#666', margin: '5px 0' }}>{user.role} | {user.companyName}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', fontSize: '0.9rem' }}>
               <div><strong>Email:</strong> {user.email}</div>
               <div><strong>Phone:</strong> {isEditing ? <input value={formData.phoneNumber} onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})} /> : user.phoneNumber}</div>
               <div><strong>Location:</strong> {isEditing ? <input value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} /> : (user.location || 'Not Set')}</div>
               <div><strong>ID:</strong> {user.employeeId}</div>
            </div>
          </div>
          
          <button className="btn" style={{width: 'auto'}} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
             {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* === TABS === */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
          <div 
            onClick={() => setActiveTab('resume')}
            style={{ padding: '15px 30px', cursor: 'pointer', borderBottom: activeTab === 'resume' ? '3px solid #007bff' : 'none', fontWeight: 'bold' }}
          >
            Resume / Private Info
          </div>
          {/* Only show Salary tab if Admin or Own Profile (logic handled by backend, but we hide tab if data missing) */}
          {(currentUser.role === 'Admin' || user.Salary) && (
             <div 
               onClick={() => setActiveTab('salary')}
               style={{ padding: '15px 30px', cursor: 'pointer', borderBottom: activeTab === 'salary' ? '3px solid #007bff' : 'none', fontWeight: 'bold' }}
             >
               Salary Info
             </div>
          )}
        </div>

        {/* === CONTENT === */}
        <div style={{ padding: '30px' }}>
          
          {/* TAB 1: RESUME */}
          {activeTab === 'resume' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
               
               {/* Left Column: About */}
               <div>
                 <h3 style={{borderBottom: '2px solid #333', paddingBottom: '5px'}}>About ✏️</h3>
                 {isEditing ? (
                    <textarea 
                      style={{width: '100%', height: '100px', padding: '10px'}} 
                      value={formData.aboutMe} 
                      onChange={(e)=>setFormData({...formData, aboutMe: e.target.value})} 
                    />
                 ) : (
                    <p style={{lineHeight: '1.6', color: '#555'}}>
                      {user.aboutMe || "No description added yet. Click Edit to add your bio."}
                    </p>
                 )}
               </div>

               {/* Right Column: Skills */}
               <div>
                  <h3 style={{borderBottom: '2px solid #333', paddingBottom: '5px'}}>Skills</h3>
                  <div style={{border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minHeight: '100px'}}>
                     {isEditing ? (
                       <input 
                         style={{width: '100%', padding: '5px'}} 
                         placeholder="React, Node, SQL..." 
                         value={formData.skills} 
                         onChange={(e)=>setFormData({...formData, skills: e.target.value})} 
                       />
                     ) : (
                       <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                          {formData.skills ? formData.skills.split(',').map(skill => (
                             <span key={skill} style={{background: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem'}}>
                               {skill}
                             </span>
                          )) : <span style={{color: '#999'}}>No skills added</span>}
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {/* TAB 2: SALARY INFO (Matches Wireframe Table) */}
          {activeTab === 'salary' && user.Salary && (
             <div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', background: '#f1f3f5', padding: '15px', borderRadius: '4px'}}>
                   <div><strong>Monthly Wage:</strong> ₹{user.Salary.baseSalary} / Month</div>
                   <div><strong>Yearly Wage:</strong> ₹{user.Salary.baseSalary * 12} / Year</div>
                </div>

                <h3>Salary Components</h3>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                   <tbody>
                      <tr style={{borderBottom: '1px solid #ddd'}}>
                         <td style={{padding: '10px'}}>Basic Salary</td>
                         <td style={{textAlign: 'right'}}>₹{user.Salary.baseSalary * 0.5}</td>
                      </tr>
                      <tr style={{borderBottom: '1px solid #ddd'}}>
                         <td style={{padding: '10px'}}>House Rent Allowance (HRA)</td>
                         <td style={{textAlign: 'right'}}>₹{user.Salary.hra}</td>
                      </tr>
                      <tr style={{borderBottom: '1px solid #ddd'}}>
                         <td style={{padding: '10px'}}>Provident Fund (Deduction)</td>
                         <td style={{textAlign: 'right', color: 'red'}}>- ₹{user.Salary.providentFund}</td>
                      </tr>
                      <tr style={{fontWeight: 'bold', background: '#f8f9fa'}}>
                         <td style={{padding: '10px'}}>Net Salary (In Hand)</td>
                         <td style={{textAlign: 'right'}}>₹{user.Salary.netSalary}</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyProfile;