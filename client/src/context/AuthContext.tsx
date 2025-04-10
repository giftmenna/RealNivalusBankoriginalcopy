import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { LoginData } from '@shared/schema';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeaders: () => { [key: string]: string };
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Token storage key
const TOKEN_STORAGE_KEY = 'nivalus_auth_token';
const USER_STORAGE_KEY = 'nivalus_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // Helper function to get stored token
  const getToken = (): string | null => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.error('Error reading token from localStorage:', e);
      return null;
    }
  };
  
  // Helper function to store token
  const storeToken = (token: string) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.error('Error storing token in localStorage:', e);
    }
  };
  
  // Helper function to store user data
  const storeUser = (userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error('Error storing user in localStorage:', e);
    }
  };
  
  // Function to get authentication headers
  const getAuthHeaders = (): { [key: string]: string } => {
    const token = getToken();
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    // Return empty object with type assertion to match return type
    return {} as { [key: string]: string };
  };
  
  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a token in localStorage
        const storedToken = getToken();
        
        if (!storedToken) {
          console.log('No stored authentication token found');
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Try to restore user from localStorage first for faster loading
        try {
          const storedUserData = localStorage.getItem(USER_STORAGE_KEY);
          if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
            console.log('Restored user from localStorage:', parsedUser);
          }
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
        
        // Verify token with server
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
          const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
              'Authorization': `Bearer ${storedToken}`
            },
            credentials: 'include', // Keep for backward compatibility
            mode: 'cors',
            cache: 'no-cache',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          if (!response.ok) {
            if (response.status === 401) {
              console.log('Auth token verification failed with status 401');
              // Clear invalid token
              localStorage.removeItem(TOKEN_STORAGE_KEY);
              localStorage.removeItem(USER_STORAGE_KEY);
              setUser(null);
              return;
            }
            throw new Error(`Auth check failed: ${response.status} ${response.statusText}`);
          }
          
          const userData = await response.json();
          
          console.log('Auth token verification successful, user data:', userData);
          
          // Update user data from server
          const verifiedUser = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            token: storedToken // Reattach token to user object
          };
          
          setUser(verifiedUser);
          
          // Update stored user data
          storeUser(verifiedUser);
        } catch (error: any) {
          clearTimeout(timeoutId);
          
          if (error.name === 'AbortError') {
            console.warn('Auth token verification timed out after 10 seconds');
            // Keep the previously loaded user data but mark a refresh needed
            console.log('Using cached user data due to timeout');
          } else {
            console.error('Auth token verification error:', error);
            // Clear invalid token
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check outer error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      // Make username case-insensitive
      const normalizedData = {
        ...data,
        username: data.username.toLowerCase()
      };
      
      // Login request
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(normalizedData),
        credentials: 'include', // Keep for backward compatibility
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
          // Try to parse error as JSON
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch (e) {
          // If not JSON, use as-is
          errorMessage = errorText;
        }
        
        throw new Error(`Login failed: ${response.status} - ${errorMessage}`);
      }
      
      const result = await response.json();
      
      console.log('Login response:', result);
      
      if (!result.token) {
        throw new Error('Login succeeded but no token was provided');
      }
      
      // Store token in localStorage
      storeToken(result.token);
      
      // Create user object with token
      const userData = {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role,
        token: result.token
      };
      
      // Store user data in localStorage
      storeUser(userData);
      
      // Set user in state
      setUser(userData);
      
      // Clear query cache
      queryClient.clear();
      
      // Redirect based on role
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      const token = getToken();
      
      if (token) {
        // Call logout endpoint with the token
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
          credentials: 'include', // Keep for backward compatibility
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          console.warn('Logout response was not OK:', response.status, response.statusText);
        }
      }
      
      // Clear token and user from localStorage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      
      // Clear all other localStorage and sessionStorage for this domain
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
      
      // Clear user state
      setUser(null);
      
      // Clear query cache
      queryClient.clear();
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server request fails
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      queryClient.clear();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
}
