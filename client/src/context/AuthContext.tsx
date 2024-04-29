import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
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
  userId: string; // 根据你的令牌内容调整
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
  
        // 使用自定义类型来指定解码后的结构
        const decoded: CustomJwtPayload = jwtDecode(response.data.token);
  
        console.log('Decoded JWT:', decoded);  // 确认包含email等关键字段
  
        setUser({
          username: response.data.username,  // 使用响应中的用户名
          email: decoded.email,  // 从自定义的解码类型中获取 email
          avatar: response.data.avatar || '/default-avatar.png',
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response ? err.response.data.message : '登录过程中出现错误');
    }
  };
  
  


const register = async (formData: any) => { // 这里的 formData 为 FormData 类型
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
    }
    console.log(response.data.message); // 显示成功或错误消息
  } catch (err) {
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/check-auth');
      // 确保响应中包含 email 和 username
      if (response.data.username && response.data.email) {
        setUser({
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar
        });
      } else {
        throw new Error('Missing user information');
      }
    } catch (err) {
      logout();
    }
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
