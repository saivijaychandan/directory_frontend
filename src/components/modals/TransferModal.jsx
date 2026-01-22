import React from 'react';

const TransferModal = ({ isOpen, onClose, mode, folders, currentFolderId, targetFolderId, setTargetFolderId, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'copy' ? 'Copy Image' : 'Move Image'}</h2>
        <p>Select destination folder:</p>

        <select
          value={targetFolderId}
          onChange={(e) => setTargetFolderId(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        >
          <option value="">-- Select Folder --</option>
          {folders
            .filter(folder => folder._id !== currentFolderId)
            .map(folder => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
        </select>

        {folders.filter(folder => folder._id !== currentFolderId).length === 0 && (
             <p style={{color: '#666', fontSize: '13px', fontStyle: 'italic', marginTop: '-10px', marginBottom: '15px'}}>
                No other folders available.
             </p>
        )}

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button 
            className="primary" 
            onClick={onConfirm}
            disabled={!targetFolderId}
            style={{ opacity: !targetFolderId ? 0.6 : 1 }}
          >
            {mode === 'copy' ? 'Copy Here' : 'Move Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;