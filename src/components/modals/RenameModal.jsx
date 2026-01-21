import React from 'react';

const RenameModal = ({ isOpen, onClose, name, setName, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rename Image</h2>
        <input 
          autoFocus 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: '15px', padding: '8px' }} 
        />
        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onConfirm}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;