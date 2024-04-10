import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Fact from './components/Fact';
import Skill from './components/Skill';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import other components similarly...

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Fact/>
        <Skill/>
        {/* Use other components here */}
      </main>
      {/* <Footer /> Uncomment and create Footer.tsx */}
    </div>
  );
}

export default App;
