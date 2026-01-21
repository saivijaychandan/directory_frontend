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
            .filter(folder => {
              if (mode === 'move') return folder._id !== currentFolderId;
              return true;
            })
            .map(folder => (
              <option key={folder._id} value={folder._id}>
                {folder.name} {folder._id === currentFolderId ? '(Current)' : ''}
              </option>
            ))}
        </select>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onConfirm}>
            {mode === 'copy' ? 'Copy Here' : 'Move Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;