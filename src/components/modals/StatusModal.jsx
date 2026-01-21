import React from 'react';

const StatusModal = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const color = isSuccess ? '#28a745' : '#dc3545'; // Green or Red

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ textAlign: 'center', width: '300px' }}
      >
        
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>
          {isSuccess ? '✅' : '❌'}
        </div>

        <h2 style={{ color: color, marginTop: 0 }}>
          {isSuccess ? 'Success!' : 'Error'}
        </h2>

        <p style={{ color: '#555', fontSize: '16px' }}>
          {message}
        </p>

        <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <button 
            className={isSuccess ? "primary" : "danger"} 
            onClick={onClose} 
            style={{ minWidth: '100px' }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;