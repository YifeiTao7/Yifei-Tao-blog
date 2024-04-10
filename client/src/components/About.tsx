import React from 'react';
import profile3Img from '../assets/img/profile3-img.jpg';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">

        <div className="section-title">
          <h2>About</h2>
          <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
        </div>

        <div className="row align-items-start">
          <div className="col-lg-4" data-aos="fade-right">
            <img src={profile3Img} className="img-fluid profile-img" alt="Profile" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content" data-aos="fade-left">
            <h3>Full-stack Developer.</h3>
            <p className="artistic-text">
              First, to know the nature of things
              <span style={{ fontSize: 'smaller', color: '#666', textAlign: 'right', display: 'block', marginRight: 20 }}>- Lucretius</span>
            </p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right"></i> <strong>Birthday:</strong> <span>7 April 1997</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Website:</strong> <span>www.yifeitao.com</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Phone:</strong> <span>+61 04981359916</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>City:</strong> <span>Canberra, Australia</span></li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right"></i> <strong>Age:</strong> <span>27</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Degree:</strong> <span>Master</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Email:</strong> <span>yifeitao970407@gmail.com</span></li>
                </ul>
              </div>
            </div>
            <p>
              Energetic Computer Science Master's graduate skilled in HTML, CSS, JavaScript, Python, Java, and modern frameworks such as React and Next.js. Recognized for a strong work ethic, quick learning capability, and excellent problem-solving skills. Thrives in team settings, contributing to project success with a proactive and collaborative approach.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
