import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../constants/Config';

// Define User Interface
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
}

// Define Context Types
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string, bio: string) => Promise<{ success: boolean; message: string }>;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cross-platform Storage Helpers
const TOKEN_KEY = 'auth_token';

const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to get from localStorage', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from localStorage', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendUrl, setBackendUrlState] = useState<string>(CONFIG.API_URL);

  const setBackendUrl = async (url: string) => {
    setBackendUrlState(url);
    if (Platform.OS === 'web') {
      localStorage.setItem('backend_url', url);
    } else {
      await SecureStore.setItemAsync('backend_url', url);
    }
  };

  // Load token and user details on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load custom backend url if saved
        const savedUrl = Platform.OS === 'web' 
          ? localStorage.getItem('backend_url') 
          : await SecureStore.getItemAsync('backend_url');
        if (savedUrl) {
          setBackendUrlState(savedUrl);
        }

        const storedToken = await getStorageItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          
          // Fetch latest user details from API
          const response = await fetch(`${savedUrl || CONFIG.API_URL}/profile.php`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          const resData = await response.json();
          if (response.ok && resData.status === 'success') {
            setUser(resData.data.user);
          } else {
            // Token is invalid/expired, clear it
            await removeStorageItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register Method
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${backendUrl}/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        return { success: true, message: resData.message };
      } else {
        return { success: false, message: resData.message || 'Registration failed.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please make sure the PHP backend is running.' };
    }
  };

  // Login Method
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${backendUrl}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        const { token: userToken, user: userData } = resData.data;
        
        await setStorageItem(TOKEN_KEY, userToken);
        setToken(userToken);
        setUser(userData);
        
        return { success: true, message: resData.message };
      } else {
        return { success: false, message: resData.message || 'Invalid credentials.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please make sure the PHP backend is running.' };
    }
  };

  // Logout Method
  const logout = async () => {
    try {
      await removeStorageItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update Profile Method
  const updateProfile = async (name: string, phone: string, bio: string) => {
    if (!token) {
      return { success: false, message: 'Not authenticated.' };
    }

    try {
      const response = await fetch(`${backendUrl}/profile.php`, {
        method: 'POST', // or 'PUT' as supported by our backend
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, bio }),
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        setUser(resData.data.user);
        return { success: true, message: resData.message };
      } else {
        return { success: false, message: resData.message || 'Failed to update profile.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Could not connect to backend.' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      register, 
      logout, 
      updateProfile,
      backendUrl,
      setBackendUrl 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
