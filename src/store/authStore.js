import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token, username) => set({ 
        token, 
        user: { username }, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;