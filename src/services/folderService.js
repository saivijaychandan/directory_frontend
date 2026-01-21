import api from '../api';

const folderService = {
  getAllFolders: () => {
    return api.get('/folders');
  },

  getFolderDetails: (id) => {
    return api.get(`/folders/${id}`);
  },

  createFolder: (name) => {
    return api.post('/folders', { name });
  },

  renameFolder: (id, name) => {
    return api.put(`/folders/${id}`, { name });
  },

  deleteFolder: (id) => {
    return api.delete(`/folders/${id}`);
  }
};

export default folderService;