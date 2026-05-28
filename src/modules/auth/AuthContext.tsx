import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config/api';

// Cross-platform storage helper
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('Storage not available', e);
      }
    } else {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (e) {
        console.warn('SecureStore error', e);
      }
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    } else {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (e) {
        return null;
      }
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    } else {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {}
    }
  },
};

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  googleId?: string | null;
  appleId?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string, role?: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple', token: string, appleUserId?: string, name?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load stored token and user profile on launch
    const bootstrapAsync = async () => {
      try {
        const storedToken = await storage.getItem('conectea_token');
        const storedUser = await storage.getItem('conectea_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to restore authentication state', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const clearError = () => setError(null);

  const handleAuthResponse = async (data: { accessToken: string; user: User }) => {
    setToken(data.accessToken);
    setUser(data.user);
    setError(null);
    await storage.setItem('conectea_token', data.accessToken);
    await storage.setItem('conectea_user', JSON.stringify(data.user));
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar login');
      }

      await handleAuthResponse(data);
    } catch (err: any) {
      setError(err.message || 'Erro de rede ou servidor indesejado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string, role: string = 'Guardian') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar cadastro');
      }

      await handleAuthResponse(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (
    provider: 'google' | 'apple',
    socialToken: string,
    appleUserId?: string,
    name?: string,
    role: string = 'Guardian',
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          token: socialToken,
          appleUserId,
          name,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro no login social com ${provider}`);
      }

      await handleAuthResponse(data);
    } catch (err: any) {
      setError(err.message || `Erro no login social com ${provider}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setToken(null);
      setUser(null);
      await storage.removeItem('conectea_token');
      await storage.removeItem('conectea_user');
    } catch (e) {
      console.warn('Error during logout', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        socialLogin,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
