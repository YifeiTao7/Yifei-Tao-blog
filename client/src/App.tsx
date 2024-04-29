// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Fact from './components/Fact';
import Skill from './components/Skill';
import Contact from './components/Contact';
import Portfolio from './components/Portfolio';
import Life from './components/Life';
import AdminPage from './pages/AdminPage';
import LifeCategoryPage from './pages/LifeCategoryPage'; // 导入 LifeCategoryPage
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Resume from './components/Resume';
import 'react-image-gallery/styles/css/image-gallery.css';
import PortfolioDetails from './pages/PortfolioDetailsPage';



const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/admin" && <Header />}
      <Routes>
        <Route path="/" element={
          <main id="main">
            <Hero />
            <About />
            <Resume/>
            <Fact />
            <Skill />
            <Portfolio />
            <Life />
            <Contact />
          </main>
        } />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/life/:category" element={<LifeCategoryPage />} /> 
        <Route path="/portfolio/:title" element={<PortfolioDetails />} /> 
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
