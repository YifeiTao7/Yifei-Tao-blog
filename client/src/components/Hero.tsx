import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import RegisterModal from './RegisterModal'; // 确保路径正确

const Hero = () => {
  const typed = useRef<any>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const options = {
      strings: [
        'Hello !', 'Hola  !', 'Bonjour  !', 'Hallo  !', 'Ciao  !', 'Привет !', 
        'こんにちは !', '안녕하세요 !', 'مرحبا !', 'नमस्ते !', 
        'Olá !', 'Hallo !', 'Hej !', 'Merhaba !', '你好 !'
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

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };

  return (
    <section 
      id="hero" 
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', position: 'relative' }} // 确保这里是相对定位
    >
      <div className="hero-container" data-aos="fade-in">
        <h1>I'm Felix Tao</h1>
        <p><span className="typed"></span></p>
        <button 
          className="btn btn-register"
          onClick={toggleRegisterModal}
          style={{
            position: 'absolute', // 绝对定位
            top: '20px', // 距离顶部20px
            right: '20px', // 距离右边20px
          }}
        >
          Register
        </button>
      </div>
      <RegisterModal show={showRegisterModal} toggleModal={toggleRegisterModal} />
    </section>
  );
};

export default Hero;
