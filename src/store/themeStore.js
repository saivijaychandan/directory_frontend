import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      lastUpdated: Date.now(), 

      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light',
        lastUpdated: Date.now()
      })),
      
      themeReset: () => set({ theme: 'light', lastUpdated: Date.now() }),

      checkExpiry: () => {
        const ONE_DAY_MS = 10 * 60 * 1000;
        const now = Date.now();
        const storedTime = get().lastUpdated;

        if (now - storedTime > ONE_DAY_MS) {
          set({ theme: 'light', lastUpdated: Date.now() });
        }
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {  
        if (state) {
          state.checkExpiry();
        }
      },
    },
  )
);

export default useThemeStore;