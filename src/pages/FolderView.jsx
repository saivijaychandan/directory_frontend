import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import imageService from '../services/imageService';
import folderService from '../services/folderService';
import { FaArrowLeft } from 'react-icons/fa'

import ImageCard from '../components/ImageCard';
import UploadButton from '../components/UploadButton';
import TransferModal from '../components/modals/TransferModal';
import ViewImageModal from '../components/modals/ViewImageModal';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';
import StatusModal from '../components/modals/StatusModal';

const FolderView = () => {
  const { folderId } = useParams();
  
  const [images, setImages] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [viewImage, setViewImage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [renameData, setRenameData] = useState({ isOpen: false, id: null, name: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });
  const [transferData, setTransferData] = useState({ isOpen: false, mode: 'copy', imageId: null, targetFolderId: '' });

  const fetchData = useCallback(async () => {
    try {
      if (images.length === 0) setIsLoading(true);
      const [folderRes, imagesRes, allFoldersRes] = await Promise.all([
        folderService.getFolderDetails(folderId),
        imageService.getImagesInFolder(folderId),
        folderService.getAllFolders()
      ]);
      setFolderName(folderRes.data.name);
      setImages(imagesRes.data);
      setAllFolders(allFoldersRes.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  }, [folderId, images.length]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpload = async (file) => {
    try {
      await imageService.uploadImage(folderId, file);
      fetchData();
    } catch (err) { alert("Upload failed"); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await imageService.deleteImage(deleteId);
      setImages(prev => prev.filter(img => img._id !== deleteId));
      setDeleteId(null);
    } catch (err) { alert("Failed"); }
  };

  const confirmRename = async () => {
    try {
      await imageService.renameImage(renameData.id, renameData.name);
      fetchData();
      setRenameData({ isOpen: false, id: null, name: '' });
    } catch (err) { alert("Failed"); }
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
        if (transferData.targetFolderId !== folderId) {
          setImages(prev => prev.filter(img => img._id !== transferData.imageId));
        }
      }
      setTransferData({ ...transferData, isOpen: false });
      if (transferData.mode === 'copy' || transferData.targetFolderId === folderId) fetchData();
    } catch (err) {
      setStatusModal({ isOpen: true, type: 'error', message: 'Operation Failed' });
    }
  };

  if (isLoading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div className="app-container">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '24px' }}><FaArrowLeft /></Link>
          <h1>{folderName}</h1>
        </div>
      </div>

      <UploadButton onUpload={handleUpload} />

      <div className="grid-container">
        {images.map(img => (
          <ImageCard 
            key={img._id} 
            img={img} 
            onView={setViewImage}
            onRename={(image) => setRenameData({ isOpen: true, id: image._id, name: image.name })}
            onDelete={setDeleteId}
            onCopy={(id) => setTransferData({ isOpen: true, mode: 'copy', imageId: id, targetFolderId: folderId })}
            onMove={(id) => setTransferData({ isOpen: true, mode: 'move', imageId: id, targetFolderId: '' })}
          />
        ))}
      </div>

      <TransferModal 
        isOpen={transferData.isOpen}
        onClose={() => setTransferData({ ...transferData, isOpen: false })}
        mode={transferData.mode}
        folders={allFolders}
        currentFolderId={folderId}
        targetFolderId={transferData.targetFolderId}
        setTargetFolderId={(id) => setTransferData({ ...transferData, targetFolderId: id })}
        onConfirm={confirmTransfer}
      />

      <ViewImageModal 
        image={viewImage} 
        onClose={() => setViewImage(null)} 
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