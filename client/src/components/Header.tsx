import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [navBarActiveClass, setNavBarActiveClass] = useState('');
  const { user } = useAuth();

  const toggleMobileNav = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const changeNavBarActiveClass = () => {
      if (window.scrollY > 100) {
        setNavBarActiveClass('navbar-shrink');
      } else {
        setNavBarActiveClass('');
      }
    };

    window.addEventListener('scroll', changeNavBarActiveClass);

    return () => {
      window.removeEventListener('scroll', changeNavBarActiveClass);
    };
  }, []);
  const iconStyle = {
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px'
  };

  return (
    <header id="header" className={`d-flex flex-column ${navBarActiveClass}`}>
      <div className="profile">
        <img src={process.env.PUBLIC_URL + '/assets/img/profile-img.jpg'} alt="Profile" style={{ borderRadius: '50%', width: '150px', height: '150px' }} className="img-fluid" />
        <h1 className="text-light"><a href="index.html">Felix Tao</a></h1>
        <div className="social-links mt-3 text-center">
        <a href="https://twitter.com/TaoYifei65419" style={iconStyle} className="twitter"><i className="bx bxl-twitter"></i></a>
          <a href="https://www.facebook.com/profile.php?id=100083851534835&mibextid=LQQJ4d" style={iconStyle} className="facebook"><i className="bx bxl-facebook"></i></a>
          <a href="https://www.instagram.com/yifei8124?igsh=Y29lYmx5dmtsazY4&utm_source=qr" style={iconStyle} className="instagram"><i className="bx bxl-instagram"></i></a>
          <a href="https://www.linkedin.com/in/yifei-tao-1b9b60276" style={iconStyle} className="linkedin"><i className="bx bxl-linkedin"></i></a>
        </div>
      </div>

      <nav id="navbar" className={`nav-menu ${isActive ? 'navbar-mobile' : ''}`}>
        <ul>
          <li><ScrollLink to="hero" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-home"></i> Home</ScrollLink></li>
          <li><ScrollLink to="about" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-user"></i> About</ScrollLink></li>
          <li><ScrollLink to="resume" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-file"></i> Resume</ScrollLink></li>
          <li><ScrollLink to="skills" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-file-blank"></i> Skills</ScrollLink></li>
          <li><ScrollLink to="portfolio" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-book-content"></i> Portfolio</ScrollLink></li>
          <li><ScrollLink to="life" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-server"></i> Life</ScrollLink></li>
          <li><ScrollLink to="contact" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-envelope"></i> Contact</ScrollLink></li>
        </ul>
      </nav>
      <i className={`mobile-nav-toggle d-xl-none ${isActive ? 'bx-x' : 'bx-menu'}`} onClick={toggleMobileNav}></i>
    </header>
  );
};

export default Header;
