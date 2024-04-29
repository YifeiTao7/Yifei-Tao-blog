import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios.config';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

interface LifeItem {
  _id: string;
  category: string;
  image: string;
  name: string;
  quote: string;
}

type CategoryItems = {
  [key: string]: LifeItem[];
}
interface ArrowButtonProps {
  onClick?: () => void; // Add this line to define the onClick type
}

// Next Arrow Button
const NextArrow: React.FC<ArrowButtonProps> = ({ onClick }) => (
  <button
    className="slick-next custom-slick-next"
    onClick={onClick}
    aria-label="Next"
    style={{ fontSize: 0 }} // Removes font size to avoid unexpected display issues
  >
    <svg
      width="100%" // 这将使SVG充满按钮容器
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

// Previous Arrow Button
const PrevArrow: React.FC<ArrowButtonProps> = ({ onClick }) => (
  <button
    className="slick-prev custom-slick-prev"
    onClick={onClick}
    aria-label="Previous"
    style={{ fontSize: 0 }} // Removes font size to avoid unexpected display issues
  >
    <svg
      width="100%" // 这将使SVG充满按钮容器
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

  const groupedByCategory = lifeItems.reduce((acc: CategoryItems, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

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
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category}>
              <Link to={`/life/${category}`}>
                <img src={items[0].image} alt={category} style={{ width: '100%' }} />
                <h4>{category}</h4>
                <p>{items[0].quote}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Life;
