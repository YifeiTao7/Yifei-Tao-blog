import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthProps {
  toggleModal: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  avatar: File | null;
}

const Auth: React.FC<AuthProps> = ({ toggleModal }) => {
  const { login, register, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    avatar: null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === 'avatar' && files && files.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        avatar: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value);
      } else if (value !== null) {
        data.append(key, String(value));
      }
    });
  
    try {
      if (isRegistering) {
        await register(data);
        toast.success('Registration successful!');
        toggleModal();
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Login successful!');
        toggleModal();
      }
    } catch (err) {
      toast.error(error || 'Authentication failed. Please try again.');
    }
  };
  
  
  return (
    <div className="auth-container mt-4">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="mb-3">{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {isRegistering && (
          <>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="avatar" className="form-label">Avatar</label>
              <input
                type="file"
                className="form-control"
                id="avatar"
                name="avatar"
                accept="image/*" 
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary button-spacing">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Auth;
