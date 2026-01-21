import api from '../api';

const imageService = {
  getImagesInFolder: (folderId) => {
    return api.get(`/folders/${folderId}/images`);
  },
  uploadImage: (folderId, file) => {
    const formData = new FormData();
    formData.append('imageFile', file);
    formData.append('folderId', folderId);
    return api.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  renameImage: (id, name) => {
    return api.put(`/images/${id}`, { name });
  },
  deleteImage: (id) => {
    return api.delete(`/images/${id}`);
  },
  copyImage: (id, targetFolderId) => {
    return api.post(`/images/${id}/copy`, { targetFolderId });
  },
  moveImage: (id, targetFolderId) => {
    return api.put(`/images/${id}/move`, { targetFolderId });
  }
};

export default imageService;