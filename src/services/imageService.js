import api from '../api';

const imageService = {
  getImagesInFolder: (folderId, token) => {
    const config = token ? { headers: { Authorization: token } } : {};
    return api.get(`/folders/${folderId}/images`, config);
  },

  uploadImage: (folderId, file, token) => {
    const formData = new FormData();
    formData.append('imageFile', file);
    formData.append('folderId', folderId);
    
    const config = {
        headers: { 
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: token })
        }
    };
    return api.post('/images', formData, config);
  },

  renameImage: (id, name) => api.put(`/images/${id}`, { name }),
  deleteImage: (id) => api.delete(`/images/${id}`),
  copyImage: (id, targetFolderId) => api.post(`/images/${id}/copy`, { targetFolderId }),
  moveImage: (id, targetFolderId) => api.put(`/images/${id}/move`, { targetFolderId })
};

export default imageService;