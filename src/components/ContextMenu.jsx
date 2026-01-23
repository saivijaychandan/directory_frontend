import React from 'react';

const ContextMenu = ({ x, y, onClose, children }) => {
  return (
    <>
      <div 
        className="context-menu-overlay" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }} 
      />
      
      <div 
        className="context-menu" 
        style={{ top: y, left: x }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

export const ContextMenuItem = ({ label, onClick, danger = false }) => (
  <button 
    className={`context-menu-item ${danger ? 'danger' : ''}`} 
    onClick={onClick}
  >
    {label}
  </button>
);

export default ContextMenu;