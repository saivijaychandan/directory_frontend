import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import imageService from '../services/imageService';
import folderService from '../services/folderService';
import { FaArrowLeft } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';
import UploadButton from '../components/UploadButton';
import TransferModal from '../components/modals/TransferModal';
import Lightbox from '../components/Lightbox';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';
import StatusModal from '../components/modals/StatusModal';
import ContextMenu, { ContextMenuItem } from '../components/ContextMenu';

const FolderView = () => {
  const { idOrName } = useParams(); 
  const token = useAuthStore((state) => state.token);

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [images, setImages] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const [isSearching, setIsSearching] = useState(false);

  const [viewImage, setViewImage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [renameData, setRenameData] = useState({ isOpen: false, id: null, name: '' });
  const [renameError, setRenameError] = useState('');
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });
  const [transferData, setTransferData] = useState({ isOpen: false, mode: 'copy', imageId: null, targetFolderId: '' });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, image: null });

  const handleContextMenu = (e, img) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, image: img });
  };

  const fetchData = useCallback(async (query = '') => {
    if (!token || !idOrName) return;

    if (!currentFolderId) setIsInitialLoading(true); 
    else setIsSearching(true);

    try {
      let realId = currentFolderId;
      if (!realId) {
        const folderRes = await folderService.getFolderDetails(idOrName);
        realId = folderRes.data._id;
        setCurrentFolderId(realId);
        setFolderName(folderRes.data.name);
      }

      let imagesRes;
      if (query.trim()) {
        imagesRes = await imageService.searchImages(realId, query);
      } else {
        imagesRes = await imageService.getImagesInFolder(realId);
      }

      const allFoldersRes = await folderService.getAllFolders();

      setImages(imagesRes.data);
      setAllFolders(allFoldersRes.data);

    } catch (err) { 
        console.error(err); 
    } finally { 
        setIsInitialLoading(false);
        setIsSearching(false);
    }
  }, [idOrName, token, currentFolderId]);

  useEffect(() => { 
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchData]);


  const handleUpload = async (file) => {
    if (!currentFolderId) return;
    try {
      await imageService.uploadImage(currentFolderId, file, token);
      fetchData();
    } catch (err) { 
      const msg = err.response?.data?.msg || "Upload failed";
      setStatusModal({ isOpen: true, type: 'error', message: msg });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await imageService.deleteImage(deleteId);
      setImages(prev => prev.filter(img => img._id !== deleteId));
      setDeleteId(null);
    } catch (err) { alert("Failed to delete"); }
  };

  const confirmRename = async () => {
    setRenameError('');
    try {
      await imageService.renameImage(renameData.id, renameData.name);
      fetchData();
      setRenameData({ isOpen: false, id: null, name: '' });
    } catch (err) { 
      const msg = err.response?.data?.msg || "Rename failed";
      setRenameError(msg);
    }
  };

  const confirmTransfer = async () => {
    if (!transferData.targetFolderId) {
      setStatusModal({ isOpen: true, type: 'error', message: "Please select a destination." });
      return;
    }
    try {
      if (transferData.mode === 'copy') {
        await imageService.copyImage(transferData.imageId, transferData.targetFolderId);
        setStatusModal({ isOpen: true, type: 'success', message: 'Image Copied!' });
      } else {
        await imageService.moveImage(transferData.imageId, transferData.targetFolderId);
        setStatusModal({ isOpen: true, type: 'success', message: 'Image Moved!' });
        if (transferData.targetFolderId !== currentFolderId) {
          setImages(prev => prev.filter(img => img._id !== transferData.imageId));
        }
      }
      setTransferData({ ...transferData, isOpen: false });
      
      if (transferData.mode === 'copy' || transferData.targetFolderId === currentFolderId) fetchData();
    } catch (err) {
      setStatusModal({ isOpen: true, type: 'error', message: 'Operation Failed' });
    }
  };

  if (isInitialLoading) {
      return <div className="loader-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="app-container">
      <div className="header" style={{ justifyContent: 'flex-start', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '24px' }}><FaArrowLeft /></Link>
          <h1 style={{fontFamily: "Momo Signature", marginRight: "200px"}}>{folderName}</h1>
        </div>
        <SearchBar 
            query={searchQuery} 
            setQuery={setSearchQuery} 
            placeholder="Search files..." 
         />
      </div>

      <UploadButton onUpload={handleUpload} />

      {isSearching ? (
         <div className="loader-container" style={{height: '200px'}}>
             <div className="spinner"></div>
         </div>
      ) : (
        <div className="grid-container">
          {images.map(img => (
            <ImageCard 
              key={img._id} 
              img={img} 
              onView={setViewImage}
              onRename={(image) => setRenameData({ isOpen: true, id: image._id, name: image.name })}
              onDelete={setDeleteId}
              onCopy={(id) => setTransferData({ isOpen: true, mode: 'copy', imageId: id, targetFolderId: currentFolderId })}
              onMove={(id) => setTransferData({ isOpen: true, mode: 'move', imageId: id, targetFolderId: '' })}
              onContextMenu={(e) => handleContextMenu(e, img)}
            />
          ))}
          
          {images.length === 0 && !searchQuery && (
              <div style={{color:'#777', fontStyle:'italic', marginTop:'20px'}}>
                  This folder is empty. Upload an image to get started.
              </div>
          )}
          {images.length === 0 && searchQuery && (
               <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1', textAlign: 'center' }}>
                  No files found matching "{searchQuery}"
              </p>
          )}
        </div>
      )}

      {contextMenu.visible && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          <ContextMenuItem 
             label="Preview" 
             onClick={() => {
               setViewImage(contextMenu.image);
               setContextMenu({ ...contextMenu, visible: false });
             }} 
          />
          <ContextMenuItem 
             label="Rename" 
             onClick={() => {
               setRenameData({ isOpen: true, id: contextMenu.image._id, name: contextMenu.image.name });
               setContextMenu({ ...contextMenu, visible: false });
             }} 
          />
          <ContextMenuItem 
             label="Copy to..." 
             onClick={() => {
               setTransferData({ isOpen: true, mode: 'copy', imageId: contextMenu.image._id, targetFolderId: currentFolderId });
               setContextMenu({ ...contextMenu, visible: false });
             }} 
          />
          <ContextMenuItem 
             label="Move to..." 
             onClick={() => {
               setTransferData({ isOpen: true, mode: 'move', imageId: contextMenu.image._id, targetFolderId: '' });
               setContextMenu({ ...contextMenu, visible: false });
             }} 
          />
          <ContextMenuItem 
             label="Delete" 
             danger={true} 
             onClick={() => {
               setDeleteId(contextMenu.image._id);
               setContextMenu({ ...contextMenu, visible: false });
             }} 
          />
        </ContextMenu>
       )}

      <TransferModal 
        isOpen={transferData.isOpen}
        onClose={() => setTransferData({ ...transferData, isOpen: false })}
        mode={transferData.mode}
        folders={allFolders}
        currentFolderId={currentFolderId} 
        targetFolderId={transferData.targetFolderId}
        setTargetFolderId={(id) => setTransferData({ ...transferData, targetFolderId: id })}
        onConfirm={confirmTransfer}
      />
      
      {viewImage && (
        <Lightbox 
          currentImage={viewImage}
          images={images}
          onClose={() => setViewImage(null)}
          onSetImage={setViewImage}
        />
      )}

      <RenameModal 
        isOpen={renameData.isOpen}
        onClose={() => { setRenameData({ ...renameData, isOpen: false }); setRenameError(''); }}
        name={renameData.name}
        setName={(name) => { setRenameData({ ...renameData, name }); setRenameError(''); }}
        onConfirm={confirmRename}
        error={renameError}
      />

      <DeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <StatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        message={statusModal.message}
      />
    </div>
  );
};

export default FolderView;