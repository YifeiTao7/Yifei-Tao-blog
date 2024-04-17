import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Fact from './components/Fact';
import Skill from './components/Skill';
import Contact from './components/Contact';
import Portfolio from './components/Portfolio';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };

  return (
    <div>
      <Header />
      {/* 把注册按钮放在Header组件之后 */}
      <main id="main">
        <Hero />
        <About />
        <Fact />
        <Skill />
        <Portfolio/>
        <Contact />
        {/* 其他可能的组件 */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
