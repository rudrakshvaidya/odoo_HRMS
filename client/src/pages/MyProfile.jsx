import React, { useEffect, useState } from 'react';
import api from '../api';
import '../Auth.css';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('resume'); 
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State including NEW FIELDS
  const [formData, setFormData] = useState({
    aboutMe: '', skills: '', location: '', phoneNumber: '',
    // Private Info
    dob: '', address: '', nationality: '', personalEmail: '', gender: '', maritalStatus: '',
    // Bank Details
    bankAccountNumber: '', bankName: '', ifscCode: '', panNumber: '', uanNumber: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/employees/${currentUser.id}`);
      setUser(res.data);
      // Pre-fill form with existing data
      setFormData({
        aboutMe: res.data.aboutMe || '',
        skills: res.data.skills ? JSON.parse(res.data.skills).join(', ') : '',
        location: res.data.location || '',
        phoneNumber: res.data.phoneNumber || '',
        dob: res.data.dob || '',
        address: res.data.address || '',
        nationality: res.data.nationality || '',
        personalEmail: res.data.personalEmail || '',
        gender: res.data.gender || '',
        maritalStatus: res.data.maritalStatus || '',
        bankAccountNumber: res.data.bankAccountNumber || '',
        bankName: res.data.bankName || '',
        ifscCode: res.data.ifscCode || '',
        panNumber: res.data.panNumber || '',
        uanNumber: res.data.uanNumber || ''
      });
    } catch (err) {
      alert('Error loading profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      await api.put(`/employees/${currentUser.id}`, {
        ...formData,
        skills: JSON.stringify(skillsArray)
      });
      setIsEditing(false);
      fetchProfile();
      alert('Profile Updated Successfully');
    } catch (err) {
      alert('Error saving profile');
    }
  };

  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '20px' }}>
      <div className="card" style={{ maxWidth: '900px', width: '100%', padding: '0' }}>
        
        {/* === HEADER (Same as before) === */}
        <div style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ffcccb', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', border: '2px solid #333' }}>✏️</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h1>
            <p style={{ color: '#666', margin: '5px 0' }}>{user.role} | {user.companyName}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', fontSize: '0.9rem' }}>
               <div><strong>Email:</strong> {user.email}</div>
               <div><strong>Phone:</strong> {isEditing ? <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /> : user.phoneNumber}</div>
               <div><strong>Location:</strong> {isEditing ? <input name="location" value={formData.location} onChange={handleChange} /> : (user.location || 'Not Set')}</div>
            </div>
          </div>
          <button className="btn" style={{width: 'auto'}} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
             {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* === TABS === */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
          {['Resume', 'Private Info', 'Salary Info', 'Security'].map((tab) => (
             <div 
               key={tab}
               onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])} // 'resume', 'private', 'salary'
               style={{ 
                 padding: '15px 30px', cursor: 'pointer', fontWeight: 'bold',
                 borderBottom: activeTab === tab.toLowerCase().split(' ')[0] ? '3px solid #007bff' : 'none',
                 color: activeTab === tab.toLowerCase().split(' ')[0] ? '#007bff' : '#555'
               }}
             >
               {tab}
             </div>
          ))}
        </div>

        {/* === TAB CONTENT === */}
        <div style={{ padding: '30px' }}>
          
          {/* 1. RESUME TAB */}
          {activeTab === 'resume' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
               <div>
                 <h3>About</h3>
                 {isEditing ? <textarea name="aboutMe" style={{width: '100%', height: '100px'}} value={formData.aboutMe} onChange={handleChange} /> : <p>{user.aboutMe || "No bio yet."}</p>}
               </div>
               <div>
                  <h3>Skills</h3>
                  {isEditing ? <input name="skills" style={{width: '100%'}} value={formData.skills} onChange={handleChange} /> : <p>{formData.skills || "No skills added"}</p>}
               </div>
            </div>
          )}

          {/* 2. PRIVATE INFO TAB (Matches Wireframe) */}
          {activeTab === 'private' && (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Personal */}
                <div>
                   <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Personal Details</h3>
                   <div className="form-group">
                      <label>Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Residing Address</label>
                      <input type="text" name="address" value={formData.address} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Nationality</label>
                      <input type="text" name="nationality" value={formData.nationality} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Personal Email</label>
                      <input type="email" name="personalEmail" value={formData.personalEmail} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Marital Status</label>
                      <select name="maritalStatus" value={formData.maritalStatus} disabled={!isEditing} onChange={handleChange} style={{width: '100%', padding: '10px'}}>
                         <option value="">Select</option>
                         <option value="Single">Single</option>
                         <option value="Married">Married</option>
                      </select>
                   </div>
                </div>

                {/* Right Column: Bank Details */}
                <div>
                   <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Bank Details</h3>
                   <div className="form-group">
                      <label>Account Number</label>
                      <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Bank Name</label>
                      <input type="text" name="bankName" value={formData.bankName} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>IFSC Code</label>
                      <input type="text" name="ifscCode" value={formData.ifscCode} disabled={!isEditing} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>PAN No</label>
                      <input type="text" name="panNumber" value={formData.panNumber} disabled={!isEditing} onChange={handleChange} />
                   </div>
                </div>
             </div>
          )}

          {/* 3. SALARY TAB */}
          {activeTab === 'salary' && (
             user.Salary ? (
                <div>
                   <div style={{background: '#f1f3f5', padding: '15px', borderRadius: '4px', marginBottom: '20px'}}>
                      <strong>Monthly Wage:</strong> ₹{user.Salary.baseSalary}
                   </div>
                   <table style={{width: '100%'}}>
                      <tbody>
                         <tr><td>Basic Salary</td><td>₹{user.Salary.baseSalary * 0.5}</td></tr>
                         <tr><td>HRA</td><td>₹{user.Salary.hra}</td></tr>
                         <tr><td style={{color: 'red'}}>Provident Fund</td><td style={{color: 'red'}}>- ₹{user.Salary.providentFund}</td></tr>
                         <tr style={{fontWeight: 'bold'}}><td>Net Salary</td><td>₹{user.Salary.netSalary}</td></tr>
                      </tbody>
                   </table>
                </div>
             ) : <p>No Salary information available. Contact Admin.</p>
          )}

          {/* 4. SECURITY TAB (Placeholder for Password Change) */}
          {activeTab === 'security' && (
             <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                <h3>Security Settings</h3>
                <button className="btn" style={{maxWidth: '200px'}} onClick={() => alert('Change Password Feature Coming Soon!')}>Change Password</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyProfile;