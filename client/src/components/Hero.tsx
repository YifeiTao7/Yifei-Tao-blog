// Hero.js
import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import AuthModalButton from './AuthModalButton'; // 确保路径正确

const Hero = () => {
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

    return () => {
      typed.current.destroy();
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <div className="hero-container" data-aos="fade-in">
        <h1>I'm Felix Tao</h1>
        <p><span className="typed"></span></p>
        <AuthModalButton />
      </div>
    </section>
  );
};

export default Hero;
