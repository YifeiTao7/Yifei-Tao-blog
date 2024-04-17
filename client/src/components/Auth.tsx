import React, { useState } from 'react';
import axiosInstance from '../axios.config';

interface AuthProps {
  onLoginSuccess: (username: string) => void;
  toggleModal: () => void;
}

const Auth = ({ onLoginSuccess, toggleModal }: AuthProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
  
    // 准备发送到后端的数据，注册时发送全部数据，登录时只发送电子邮件和密码
    const dataToSend = isRegistering ? formData : { email: formData.email, password: formData.password };

    try {
      // 发送请求到后端API
      const response = await axiosInstance.post(endpoint, dataToSend);
      console.log(response.data);
      // 如果是登录，调用onLoginSuccess
      if (!isRegistering) {
        onLoginSuccess(formData.username); // 可根据实际情况调用，也可能是formData.email
      }
      toggleModal(); // 成功后关闭模态框
    } catch (error) {
      console.error('An error occurred:', error);
      // 可以在这里处理错误，例如显示错误消息
    }
  };

  return (
    <div className="auth-container mt-4">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="mb-3">{isRegistering ? 'Register' : 'Login'}</h2>

        {isRegistering && (
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">{isRegistering ? 'Register' : 'Login'}</button>
        <button type="button" className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
