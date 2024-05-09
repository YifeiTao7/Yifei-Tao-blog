import React from 'react';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">

        <div className="section-title">
          <h2>About</h2>
        </div>

        <div className="row align-items-center">
          <div className="col-lg-4" data-aos="fade-right">
            <img src={process.env.PUBLIC_URL +'/assets/img/profile3-img.jpg'} className="img-fluid profile-img" alt="Profile" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content" data-aos="fade-left">
            <h3>Full-stack Developer.</h3>
            <p className="artistic-text">
              First, to know the nature of things
              <span className="quote-author">- Lucretius</span>
            </p>
            <div className="row info-list">
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right"></i> <strong>Website:</strong> <span>www.yifei-tao.com</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Phone:</strong> <span>+61 0481359916</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>City:</strong> <span>Canberra, Australia</span></li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right"></i> <strong>Age:</strong> <span>27</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Degree:</strong> <span>Master of computing</span></li>
                  <li><i className="bi bi-chevron-right"></i> <strong>Email:</strong> <span>yifeitao970407@gmail.com</span></li>
                </ul>
              </div>
            </div>
            <p className="personal-description">
            Hello everyone! I'm an energetic and optimistic person who loves embracing life with a positive attitude each day. I have a great passion for basketball and tennis, both of which keep me healthy and bring immense joy and challenge to my life. At work, I always maintain a proactive stance, striving to perform at my best. I believe that through teamwork and personal effort, we can achieve any goal. I'm looking forward to building a bright future together with all of you and hope to meet more like-minded friends to share the joys of life.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
