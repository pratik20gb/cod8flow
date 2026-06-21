import { create } from 'zustand';

interface User {
  email: string;
  role: string;
}

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, email: string, role: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  login: (accessToken, refreshToken, email, role) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    set({ accessToken, refreshToken, user: { email, role }, isAuthenticated: true });
  },

  logout: () => {
    ['accessToken', 'refreshToken', 'userEmail', 'userRole'].forEach(k => localStorage.removeItem(k));
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    if (token) {
      set({
        accessToken: token,
        refreshToken: refresh,
        user: email ? { email, role: role ?? '' } : null,
        isAuthenticated: true,
      });
    }
  },
}));
