import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios.config';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

interface LifeItem {
  _id: string;
  category: string;
  images: string[];
  name: string;
  quote: string;
}

interface ArrowButtonProps {
  onClick?: () => void;
}

const NextArrow: React.FC<ArrowButtonProps> = ({ onClick }) => (
  <button
    className="slick-next custom-slick-next"
    onClick={onClick}
    aria-label="Next"
    style={{ fontSize: 0 }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
);

const PrevArrow: React.FC<ArrowButtonProps> = ({ onClick }) => (
  <button
    className="slick-prev custom-slick-prev"
    onClick={onClick}
    aria-label="Previous"
    style={{ fontSize: 0 }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
);

const Life: React.FC = () => {
  const [lifeItems, setLifeItems] = useState<LifeItem[]>([]);

  useEffect(() => {
    const fetchLifeItems = async () => {
      try {
        const response = await axiosInstance.get<LifeItem[]>('/life');
        setLifeItems(response.data);
      } catch (error) {
        console.error('Error fetching life items:', error);
      }
    };

    fetchLifeItems();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow onClick={undefined} />,
    prevArrow: <PrevArrow onClick={undefined} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section id="life" className="section-bg">
      <div className="container">
        <div className="section-title">
          <h2>Life</h2>
          <p>Here is a record of my wonderful everyday life</p>
        </div>
        <Slider {...settings}>
          {lifeItems.map((item) => (
            <div key={item._id}>
              <Link to={`/life/${item.category}`}>
                <img src={item.images[0]} alt={item.category} style={{ width: '100%' }} />
                <h4>{item.category}</h4>
                <p>{item.quote}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Life;
