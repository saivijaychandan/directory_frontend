import React, { useState, useEffect, useRef, useCallback } from 'react'; // 1. Added useCallback
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ImageCard from '../components/ImageCard';

const FolderView = () => {
  const { folderId } = useParams();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // --- STATES FOR MODALS ---
  const [deleteId, setDeleteId] = useState(null);
  const [renameData, setRenameData] = useState({ isOpen: false, id: null, name: '' });

  // 2. FIXED: Define this OUTSIDE so everyone can use it
  // We use useCallback to prevent infinite loops in useEffect
  const fetchImages = useCallback(async () => {
    try {
      const res = await api.get(`/folders/${folderId}/images`);
      setImages(res.data);
    } catch (err) { console.error(err); }
  }, [folderId]);

  // 3. FIXED: Now useEffect just calls the shared function
  useEffect(() => {
    fetchImages(); 
  }, [fetchImages]);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('imageFile', selectedFile);
    formData.append('folderId', folderId);
    try {
      await api.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchImages(); // 4. Now this works!
    } catch (err) { alert("Upload failed"); } 
    finally { if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  // --- ACTIONS ---
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/images/${deleteId}`);
      // Optimistic update (faster than fetching again)
      setImages(images.filter(img => img._id !== deleteId));
      setDeleteId(null);
    } catch (err) { alert("Failed"); }
  };

  const confirmRename = async () => {
    if (!renameData.name) return;
    try {
      await api.put(`/images/${renameData.id}`, { name: renameData.name });
      fetchImages(); // 5. Now this works too!
      setRenameData({ isOpen: false, id: null, name: '' });
    } catch (err) { alert("Failed"); }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '24px' }}>⬅️</Link>
          <h1>Folder Gallery</h1>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
        <button className="primary" onClick={() => fileInputRef.current.click()}>Upload Photo</button>
      </div>

      <div className="grid-container">
        {images.map(img => (
          <ImageCard 
            key={img._id} 
            img={img} 
            onRename={(image) => setRenameData({ isOpen: true, id: image._id, name: image.name })}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {/* --- RENAME MODAL --- */}
      {renameData.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameData({...renameData, isOpen: false})}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Rename Image</h2>
                <input 
                    autoFocus type="text" 
                    value={renameData.name} 
                    onChange={(e) => setRenameData({...renameData, name: e.target.value})}
                    style={{ width: '100%', boxSizing: 'border-box', marginBottom: '15px' }}
                />
                <div className="modal-actions">
                    <button className="secondary" onClick={() => setRenameData({...renameData, isOpen: false})}>Cancel</button>
                    <button className="primary" onClick={confirmRename}>Save</button>
                </div>
            </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{color: '#d9534f'}}>Delete Image?</h2>
                <p>Are you sure you want to delete this image permanently?</p>
                <div className="modal-actions">
                    <button className="secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                    <button className="danger" onClick={confirmDelete}>Yes, Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FolderView;