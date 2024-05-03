import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModalButton from './AuthModalButton';

const Hero = () => {
  const { user } = useAuth();
  const typed = useRef<any>(null);

  useEffect(() => {
    const options = {
      strings: [
        'Hello!', 'Hola!', 'Bonjour!', 'Hallo!', 'Ciao!', 'Привет!',
        'こんにちは!', '안녕하세요!', 'مرحبا!', 'नमस्ते!',
        'Olá!', 'Hallo!', 'Hej!', 'Merhaba!', '你好!'
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    };

    typed.current = new Typed('.typed', options);

    return () => typed.current.destroy();
  }, []);

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);
  
  return (
    <section
      id="hero"
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <div className="hero-container" data-aos="fade-in">
        <h1>I'm Felix Tao</h1>
        <p><span className="typed"></span></p>
        <AuthModalButton isMessageBoard={false} />
        {user && (
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            className="user-avatar"
            style={{ width: 50, height: 50, borderRadius: '50%' }}
          />
        )}
        
        {user && user.email === 'yifeitao970407@gmail.com' && (
          <Link to="/admin" className="btn btn-primary mt-3" >
          Admin Panel
      </Link>
      
        )}
      </div>
    </section>
  );
};

export default Hero;
