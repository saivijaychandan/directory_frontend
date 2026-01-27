import React, { useState, useEffect } from 'react';
import api from '../api';
import useAuthStore from '../store/authStore';

const ProfileModal = ({ isOpen, onClose, isForced }) => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
        setFormData({
            name: user.name || '',
            age: user.age || '',
            phone: user.phone || ''
        });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.age || !formData.phone) {
        setError("All fields are required.");
        return;
    }

    try {
        const res = await api.put('/auth/profile', formData);
        updateUser(res.data.user);
        onClose();
    } catch (err) {
        setError("Failed to update profile.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h2>{isForced ? 'Complete Your Profile' : 'Edit Profile'}</h2>
        
        {isForced && (
            <p style={{marginBottom: '15px', color: '#666', fontSize: '14px'}}>
                Please fill in your details to continue.
            </p>
        )}

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                type="text" placeholder="Full Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
                type="number" placeholder="Age" 
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
            />
            <input 
                type="tel" placeholder="Phone Number" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            
            <button type="submit" className="primary">
                {isForced ? 'Save & Continue' : 'Save Changes'}
            </button>

            {!isForced && (
                <button type="button" className="secondary" onClick={onClose}>
                    Cancel
                </button>
            )}
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;