import api from '../api';

const folderService = {
  getAllFolders: (token) => {
    const config = token ? { headers: { Authorization: token } } : {};
    return api.get('/folders', config);
  },

  getFolderByName: (folderName) => {
    return api.get(`/folders/${folderName}`);
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