import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import folderService from '../services/folderService';
import useThemeStore from '../store/themeStore';
import { FiSun, FiMoon } from 'react-icons/fi'

const Dashboard = () => {
  const { theme, toggleTheme } = useThemeStore();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const FOLDER_ICON_URL = "https://cdn-icons-png.flaticon.com/512/3767/3767084.png";

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [deleteId, setDeleteId] = useState(null);

  const [renameData, setRenameData] = useState({ isOpen: false, id: null, name: '' });

  const [isLoading, setIsLoading] = useState(true);

  const [createError, setCreateError] = useState('');

  const fetchFolders = useCallback(async () => {
    try {
      const res = await folderService.getAllFolders(token);
      setFolders(res.data);
    } catch (err) { 
      alert("Failed to load folders:");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
        fetchFolders();
    } else {
      setIsLoading(false);
    }
  }, [token, fetchFolders]);

  const handleCreate = async () => {
    if (!newFolderName) return;
    setCreateError('');

    try {
      await folderService.createFolder(newFolderName);
      setNewFolderName('');
      setCreateModalOpen(false);
      fetchFolders();
    } catch (err) { 
      const msg = err.response?.data?.msg || "Error creating folder";
      setCreateError(msg);
    }
  };

  const confirmRename = async () => {
    if (!renameData.name) return;
    try {
      await folderService.renameFolder(renameData.id, renameData.name);
      setRenameData(prev => ({...prev, isOpen: false}));
      fetchFolders();
    } catch (err) {
       const msg = err.response?.data?.msg || "Rename failed";
       alert(msg); 
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await folderService.deleteFolder(deleteId);
      setDeleteId(null);
      fetchFolders();
    } catch (err) { alert("Error deleting"); }
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
        <div style={{ marginLeft: '55%', display: 'flex', alignItems: 'center', gap: '15px' }}></div>
        <button 
                onClick={toggleTheme}
                style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                }}
            >
                {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
        <h1 style={{marginLeft: 'auto', marginRight: '20px', fontSize: '18px'}}>Welcome, {user?.username}</h1>
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
          <Link 
            to={`/folder/${folder.name}`} 
            key={folder._id} 
            style={{ textDecoration: 'none' }}
          > 
            <div className="folder-card">
              <img src={FOLDER_ICON_URL} alt="folder" className="folder-icon-img" style={{width:90}}/>
              <div className="folder-name truncate-text">{folder.name}</div>
              
              <div className="card-actions">
                <button className="secondary" onClick={(e) => {
                    e.preventDefault();
                    setRenameData({ isOpen: true, id: folder._id, name: folder.name });
                }}>Rename</button>

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
        <div className="modal-overlay" onClick={() => {
            setCreateModalOpen(false);
            setCreateError('');
        }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Folder</h2>
                
                <input 
                    autoFocus 
                    type="text" 
                    placeholder="Folder Name" 
                    value={newFolderName} 
                    onChange={(e) => {
                        setNewFolderName(e.target.value);
                        setCreateError('');
                    }}
                    style={{ 
                        width: '100%', 
                        boxSizing: 'border-box', 
                        marginBottom: createError ? '10px' : '15px',
                        border: createError ? '1px solid red' : '1px solid #ccc'
                    }}
                />
                {createError && (
                    <div style={{ color: '#d9534f', fontSize: '14px', marginBottom: '15px' }}>
                        {createError}
                    </div>
                )}
                <div className="modal-actions">
                    <button className="secondary" onClick={() => {
                        setCreateModalOpen(false);
                        setCreateError('');
                    }}>Cancel</button>
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