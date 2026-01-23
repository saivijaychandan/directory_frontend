import React from 'react';

const getFileInfo = (filename) => {
  if (!filename) return { name: "Unknown", ext: "" };
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return { name: filename, ext: '' };
  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex + 1).toUpperCase();
  return { name, ext };
};

const ImageCard = ({ img, onView, onContextMenu }) => {
  const { name, ext } = getFileInfo(img.name);

  const getBadgeColor = (type) => {
      if (type === 'JPG' || type === 'JPEG') return '#e3f2fd'; 
      if (type === 'PNG') return '#e8f5e9'; 
      return '#f5f5f5'; 
  };

  return (
    <div className="image-card" style={{ width: '240px' }} onContextMenu={onContextMenu} >
      <img 
        src={`${process.env.REACT_APP_API_URL}/images/${img._id}`} 
        alt={img.name} 
        className="image-preview"
        onClick={() => onView(img)}
        style={{ cursor: 'pointer', height: '160px', objectFit: 'cover', width: '100%' }}
      />
      
      <div style={{ padding: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
          <p 
            title={name}
            style={{ margin: 0, fontSize: '15px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}
          >
            {name}
          </p>
          {ext && (
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', backgroundColor: getBadgeColor(ext), padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                {ext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;