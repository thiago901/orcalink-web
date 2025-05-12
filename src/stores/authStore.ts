import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  avatar?: string;
  iat: number;
  exp: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser({ email, password });
          
          const { token } = response;
          
          // Decode token to get user info
          const decoded = jwtDecode<JwtPayload>(token);
          
          // Set user data and token
          set({
            token,
            user: {
              id: decoded.sub,
              name: decoded.name,
              email: decoded.email,
              avatar: decoded.avatar,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to login' 
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            get().logout();
          } else {
            // Token valid, update user if needed
            set({
              user: {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.avatar,
              },
              isAuthenticated: true,
            });
          }
        } catch (error) {
          // Invalid token
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);