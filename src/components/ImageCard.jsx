import React from 'react';

// We receive the image data and the action functions as "props"
const ImageCard = ({ img, onRename, onDelete }) => {
  return (
    <div className="image-card">
      <img 
        src={`http://localhost:5000/api/images/${img._id}`} 
        alt={img.name} 
        className="image-preview"
      />
      <div style={{ padding: '10px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {img.name}
        </p>
        
        <div className="card-actions">
          <button 
            className="secondary" 
            style={{ fontSize: '12px' }} 
            onClick={() => onRename(img)}
          >
            Rename
          </button>
          
          <button 
            className="danger" 
            style={{ fontSize: '12px' }} 
            onClick={() => onDelete(img._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;