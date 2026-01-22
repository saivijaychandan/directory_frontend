import React, { useRef } from 'react';

const UploadButton = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: '10px', 
      marginBottom: '30px', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
    }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <button 
        className="primary" 
        onClick={() => fileInputRef.current.click()}
      >
        Upload Photo
      </button>
    </div>
  );
};

export default UploadButton;