import api from '../api';

const folderService = {
  getAllFolders: () => {
    return api.get('/folders');
  },

  searchFolder: (query) => {
    return api.get(`/folders/search?folderName=${encodeURIComponent(query)}`);
  },

  getFolderDetails: (idOrName) => {
    return api.get(`/folders/${idOrName}`);
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