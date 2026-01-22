import React from 'react';

const CreateModal = ({ isOpen, onClose, name, setName, onConfirm, error }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Folder</h2>
        
        <input 
          autoFocus 
          type="text" 
          placeholder="Folder Name"
          value={name} 
          onChange={(e) => setName(e.target.value)}
          style={{ 
            width: '100%', 
            marginBottom: error ? '10px' : '15px',
            border: error ? '1px solid red' : '1px solid var(--input-border)'
          }}
        />

        {error && (
            <div style={{ color: '#d9534f', fontSize: '14px', marginBottom: '15px' }}>
                {error}
            </div>
        )}

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onConfirm}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;