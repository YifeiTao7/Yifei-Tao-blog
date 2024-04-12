interface TestimonialItemProps {
    text: string;
    image: string;
    author: string;
    role: string;
  }
  
  function TestimonialItem(props: TestimonialItemProps) {
    const { text, image, author, role } = props;
    return (
      <div className="swiper-slide">
        <div className="testimonial-item" data-aos="fade-up">
          <p>
            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
            {text}
            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
          </p>
          <img src={image} className="testimonial-img" alt={author} />
          <h3>{author}</h3>
          <h4>{role}</h4>
        </div>
      </div>
    );
  }
  
  export default TestimonialItem;