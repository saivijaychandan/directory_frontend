import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import folderService from '../services/folderService';
import useThemeStore from '../store/themeStore';
import { FiSun, FiMoon } from 'react-icons/fi';
import CreateModal from '../components/modals/CreateModal';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';

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

      <CreateModal 
        isOpen={createModalOpen}
        onClose={() => { setCreateModalOpen(false); setCreateError(''); }}
        name={newFolderName}
        setName={(val) => { setNewFolderName(val); setCreateError(''); }}
        onConfirm={handleCreate}
        error={createError}
      />

      <RenameModal 
        isOpen={renameData.isOpen}
        onClose={() => setRenameData({ ...renameData, isOpen: false })}
        name={renameData.name}
        setName={(name) => setRenameData({ ...renameData, name })}
        onConfirm={confirmRename}
      />

      <DeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Dashboard;