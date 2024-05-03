import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import axiosInstance from '../axios.config';
import { jwtDecode } from 'jwt-decode';


interface User {
  username: string;
  email:string;
  avatar:string;
}

interface AuthContextType {
  user: User | null;
  login: (formData: LoginForm) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  error: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface CustomJwtPayload {
  userId: string;
  email: string;
}


const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  const login = async (formData: any) => {
    try {
      const response = await axiosInstance.post('/users/login', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
  
        const decoded: CustomJwtPayload = jwtDecode(response.data.token); 
        setUser({
          username: response.data.username,
          email: decoded.email,
          avatar: response.data.avatar || '/default-avatar.png',
        });
      }
    } catch (err: any) {
      setError(err.response ? err.response.data.message : 'There is error in login process');
    }
  };
  
  


  const register = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar
        });
        setError('');
      } else {
        await login({
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        });
      }
    } catch (err: any) {
      setError(err.response ? err.response.data.message : 'There is register in login process');
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
