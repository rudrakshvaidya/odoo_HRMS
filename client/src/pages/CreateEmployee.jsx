import React, { useState } from 'react';
import api from '../api';
import '../Auth.css'; // Reuse CSS

const CreateEmployee = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'Employee' });
  const [result, setResult] = useState(null); // To show generated credentials
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    
    try {
      const res = await api.post('/employees/create', formData);
      setResult(res.data.credentials); // Save credentials to display
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating employee');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card" style={{maxWidth: '500px'}}>
        <h2>Create New Employee</h2>
        
        {/* Success State: Show Generated Credentials */}
        {result ? (
          <div style={{background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px'}}>
            <h3 style={{marginTop:0}}>Success!</h3>
            <p>Please save these credentials immediately:</p>
            <p><strong>Employee ID:</strong> {result.employeeId}</p>
            <p><strong>Password:</strong> {result.password}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <button onClick={() => window.location.reload()} className="btn" style={{background: '#28a745'}}>Create Another</button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            
            <div style={{display: 'flex', gap: '10px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>First Name</label>
                <input name="firstName" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Last Name</label>
                <input name="lastName" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" onChange={handleChange} value={formData.role}>
                <option value="Employee">Employee</option>
                <option value="HR">HR Officer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn">Generate ID & Create</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEmployee;