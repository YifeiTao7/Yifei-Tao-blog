import React from 'react';

function Resume() {
  return (
    <section id="resume" className="resume">
      <div className="container">

        <div className="section-title">
          <h2>Resume</h2>
        </div>

        <div className="row">
          <div className="col-lg-6" data-aos="fade-up">
            <h3 className="resume-title">Sumary</h3>
            <div className="resume-item pb-0">
              <h4>Yifei Tao</h4>
              <p><em>Energetic Computer Science Master's graduate skilled in
HTML, CSS, JavaScript, Python, Java, and modern
frameworks such as React and Next.js. Recognized for a
strong work ethic, quick learning capability, and excellent
problem-solving skills. Thrives in team settings, contributing
to project success with a proactive and collaborative
approach.
</em></p>
              <ul>
                <li>Canberra</li>
                <li>(+61) 0481359916</li>
                <li>yifeitao970407@gmail.com</li>
              </ul>
            </div>

            <h3 className="resume-title">Education</h3>
            <div className="resume-item">
              <h4>Master of Computing</h4>
              <h5>2020 - 2022</h5>
              <p><em>The Australian National University</em></p>
              <p>Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui ut dignissimos deleniti nerada porti sand markend</p>
            </div>
            <div className="resume-item">
              <h4>Bachelor of Engineering</h4>
              <h5>2016 - 2020</h5>
              <p><em>Wuhan University of Technology</em></p>
              <p>Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart dila</p>
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <h3 className="resume-title">Professional Experience</h3>
            <div className="resume-item">
              <h4>Full-Stack Developer</h4>
              <h5>January 2024 - April 2024</h5>
              <p><em>Accented AI, Canberra </em></p>
              <ul>
                <li>Developed a critical module using React and Next.js, enhancing
navigation and efficiency by embedding search parameters.
</li>
                <li>Implemented an interactive knowledge graph with ReactFlow for
intuitive exploration of complex data relationships.
</li>
                <li>Streamlined backend data processes by crafting GraphQL
queries for Hasura database migrations and data fetching.
Enhanced UI interactivity by designing a data-driven slider for
daily analytics, boosting user engagement.</li>
                <li>Processed large datasets with Python and Pandas, creating test
data to support application testing and QA.
</li>
<li>Quickly mastered Next.js, Tailwind CSS, and React, demonstrating
a strong ability to learn new technologies rapidly.</li>
<li>Managed version control with Git, focusing on a clean commit
history through interactive rebasing to improve team
collaboration and project tracking.</li>
              </ul>
            </div>
            <h3 className="resume-title">School Project Experience</h3>
            <div className="resume-item">
              <h4>Web developer</h4>
              <h5>February 2022 - November 2022</h5>
              <p><em>Wisdom Connect</em></p>
              <ul>
                <li>Designed web navigation and routing paths utilizing Vue.js,
enhancing user experience across the platform.
</li>
                <li>Collaborated in a team to integrate front and back-end data
exchange, applying HTML, CSS, and JavaScript skills.</li>
                
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Resume;
