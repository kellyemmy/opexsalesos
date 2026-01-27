import { create } from 'zustand';

/**
 * User and Auth Types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep';
  avatar?: string;
  createdAt: string;
}

/**
 * App Store Interface
 */
interface AppState {
  // ===== Auth State =====
  authUser: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuthUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  /**
   * Load auth state from localStorage on app startup
   * Call this in App.tsx useEffect
   */
  initializeAuth: () => void;
  
  /**
   * Clear all auth state on logout
   */
  logout: () => void;

  // ===== UI State =====
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  activeModalType: 'createLead' | 'editLead' | 'createCampaign' | null;
  openModal: (type: 'createLead' | 'editLead' | 'createCampaign') => void;
  closeModal: () => void;

  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // ===== App Context State =====
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;

  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;

  // Toast notification queue (alternative to Sonner)
  toastQueue: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

/**
 * Zustand Store
 * Keep lightweight - delegate server state to React Query
 */
export const useAppStore = create<AppState>((set) => ({
  // ===== Auth State Defaults =====
  authUser: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,

  setAuthUser: (user) =>
    set((state) => ({
      authUser: user,
      isAuthenticated: !!user,
    })),

  setAccessToken: (token) => set({ accessToken: token }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  initializeAuth: () => {
    // Load from localStorage (called on app startup)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      try {
        set({
          authUser: JSON.parse(storedUser),
          accessToken: storedToken,
          isAuthenticated: true,
        });
      } catch (e) {
        // Corrupted localStorage, clear it
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({
      authUser: null,
      accessToken: null,
      isAuthenticated: false,
      selectedLeadId: null,
      selectedCampaignId: null,
    });
  },

  // ===== UI State Defaults =====
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeModalType: null,
  openModal: (type) => set({ activeModalType: type }),
  closeModal: () => set({ activeModalType: null }),

  theme: 'system',
  setTheme: (theme) => set({ theme }),

  // ===== App Context State Defaults =====
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  selectedCampaignId: null,
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),

  // ===== Toast Queue =====
  toastQueue: [],
  addToast: (message, type) =>
    set((state) => ({
      toastQueue: [
        ...state.toastQueue,
        {
          id: `${Date.now()}-${Math.random()}`,
          type,
          message,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((toast) => toast.id !== id),
    })),
}));

/**
 * Hook to check if user has a specific role
 */
export const useHasRole = (requiredRoles: User['role'] | User['role'][]) => {
  const authUser = useAppStore((state) => state.authUser);
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return authUser ? roles.includes(authUser.role) : false;
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAppStore((state) => state.isAuthenticated);
};
