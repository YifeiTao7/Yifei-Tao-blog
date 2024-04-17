import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import 'boxicons/css/boxicons.min.css';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [navBarActiveClass, setNavBarActiveClass] = useState('');

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
        <img src={'/assets/img/profile-img.jpg'} alt="Profile" style={{ borderRadius: '50%', width: '150px', height: '150px' }} className="img-fluid" />
        <h1 className="text-light"><a href="index.html">Felix Tao</a></h1>
        <div className="social-links mt-3 text-center">
          <a href="#" style={iconStyle} className="twitter"><i className="bx bxl-twitter"></i></a>
          <a href="#" style={iconStyle} className="facebook"><i className="bx bxl-facebook"></i></a>
          <a href="#" style={iconStyle} className="instagram"><i className="bx bxl-instagram"></i></a>
          <a href="#" style={iconStyle} className="google-plus"><i className="bx bxl-skype"></i></a>
          <a href="#" style={iconStyle} className="linkedin"><i className="bx bxl-linkedin"></i></a>
        </div>
      </div>

      <nav id="navbar" className={`nav-menu ${isActive ? 'navbar-mobile' : ''}`}>
        <ul>
          <li><Link to="hero" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-home"></i> Home</Link></li>
          <li><Link to="about" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-user"></i> About</Link></li>
          <li><Link to="resume" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-file-blank"></i> Resume</Link></li>
          <li><Link to="portfolio" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-book-content"></i> Portfolio</Link></li>
          <li><Link to="services" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-server"></i> Services</Link></li>
          <li><Link to="contact" className="nav-link scrollto" onClick={toggleMobileNav}><i className="bx bx-envelope"></i> Contact</Link></li>
        </ul>
      </nav>
      <i className={`mobile-nav-toggle d-xl-none ${isActive ? 'bx-x' : 'bx-menu'}`} onClick={toggleMobileNav}></i>
    </header>
  );
};

export default Header;
