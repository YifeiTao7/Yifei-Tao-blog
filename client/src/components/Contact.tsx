import MessageBoard from './MessageBoard';

function Contact() {
  const projectId = 'main';
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contact</h2>
        </div>
        <div className="row" data-aos="fade-in">
          <div className="col-lg-5 d-flex align-items-stretch">
            <div className="info">
              <div className="address">
                <i className="bi bi-geo-alt"></i>
                <h4>Location:</h4>
                <p>Canberra</p>
              </div>
              <div className="email">
                <i className="bi bi-envelope"></i>
                <h4>Email:</h4>
                <p>yifeitao970407@gmail.com</p>
              </div>
              <div className="phone">
                <i className="bi bi-phone"></i>
                <h4>Call:</h4>
                <p>+61 0481359916</p>
              </div>
              <iframe src="https://www.google.com/maps/embed?..." title="Google Map" frameBorder="0" style={{ border: 0, width: '100%', height: '290px' }} allowFullScreen></iframe>

            </div>
          </div>
          <div className="col-lg-7 mt-5 mt-lg-0">
            <MessageBoard projectId={projectId} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
