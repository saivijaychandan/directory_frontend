import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import folderService from '../services/folderService';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const FOLDER_ICON_URL = "https://cdn-icons-png.flaticon.com/512/3767/3767084.png";

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [deleteId, setDeleteId] = useState(null);

  const [renameData, setRenameData] = useState({ isOpen: false, id: null, name: '' });

  const [isLoading, setIsLoading] = useState(true);

  const fetchFolders = useCallback(async () => {
    try {
      setFolders(prev => {
         if(prev.length === 0) setIsLoading(true); 
         return prev;
      });
      const res = await folderService.getAllFolders();
      setFolders(res.data);
    } catch (err) { 
      alert("Failed to load folders"); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  const handleCreate = async () => {
    if (!newFolderName) return;
    try {
      await folderService.createFolder(newFolderName);
      setNewFolderName('');
      setCreateModalOpen(false);
      fetchFolders();
    } catch (err) { alert("Error creating folder"); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await folderService.deleteFolder(deleteId);
      setDeleteId(null);
      fetchFolders();
    } catch (err) { alert("Error deleting"); }
  };

  const confirmRename = async () => {
    if (!renameData.name) return;
    try {
      await folderService.renameFolder(renameData.id, renameData.name);
      setRenameData(prev => ({...prev, isOpen: false}))
      fetchFolders();
    } catch (err) { alert("Rename failed"); }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>My Drive</h1>
        <h1 style={{marginLeft: 'auto', marginRight: '20px', fontSize: '18px'}}>Welcome, {username}</h1>
        <button className="danger" onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}>Logout</button>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex' }}>
        <button className="primary" onClick={() => setCreateModalOpen(true)}>+ Create Folder</button>
      </div>

      <div className="grid-container">
        {folders.map(folder => (
          <Link to={`/folder/${folder._id}`} key={folder._id} style={{ textDecoration: 'none' }}>
            <div className="folder-card">
              <img src={FOLDER_ICON_URL} alt="folder" className="folder-icon-img" style={{width:90}}/>
              <div className="folder-name truncate-text">{folder.name}</div>
              
              <div className="card-actions">
                <button className="secondary" onClick={(e) => {
                    e.preventDefault();
                    setRenameData({ isOpen: true, id: folder._id, name: folder.name });
                }}>Edit</button>
                
                <button className="danger" onClick={(e) => {
                    e.preventDefault();
                    setDeleteId(folder._id);
                }}>Delete</button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Folder</h2>
                <input 
                    autoFocus type="text" placeholder="Folder Name" 
                    value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', marginBottom: '15px' }}
                />
                <div className="modal-actions">
                    <button className="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</button>
                    <button className="primary" onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
      )}

      {renameData.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameData({...renameData, isOpen: false})}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Rename Folder</h2>
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

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{color: '#d9534f'}}>Are you sure?</h2>
                <p>Do you really want to delete this folder? All contents will be lost.</p>
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

export default Dashboard;