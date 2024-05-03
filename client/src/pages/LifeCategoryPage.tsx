import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios.config';
import { useParams, Link } from 'react-router-dom';

interface LifeItem {
  _id: string;
  images: string[];
  name: string;
  quote: string;
}

type Params = {
  category: string;
}

const CategoryDetailsPage = () => {
  const [items, setItems] = useState<LifeItem[]>([]);
  const { category } = useParams<Params>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<LifeItem[]>(`/life/category/${category}`);
        setItems(response.data);
      } catch (error) {
      }
    };

    fetchData();
  }, [category]);

  return (
    <main id="main">
      <section id="breadcrumbs" className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Life Details</h2>
            <ol>
              <li><Link to="/">Home</Link></li>
              <li>Life Details</li>
            </ol>
          </div>
        </div>
      </section>
      <section id="portfolio-details" className="portfolio-details">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8">
              <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel"  data-bs-interval="3000">
                <div className="carousel-indicators">
                  {items.flatMap((item, i) => 
                    item.images.map((_, index) => (
                      <button key={`${item._id}-${index}`} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index + i * item.images.length} className={index === 0 ? 'active' : ''} aria-current={index === 0 ? 'true' : false} aria-label={`Slide ${index + 1 + i * item.images.length}`}></button>
                    ))
                  )}
                </div>
                <div className="carousel-inner">
                  {items.flatMap((item, itemIndex) =>
                    item.images.map((image, index) => (
                      <div key={`${item._id}-${index}`} className={`carousel-item ${itemIndex === 0 && index === 0 ? 'active' : ''}`}>
                        <img src={image} className="d-block w-100" alt={item.name} style={{ maxHeight: '500px', objectFit: 'contain' }} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-info">
                <h3>Project information</h3>
                {items.length > 0 && (
                  <ul>
                    <li><strong>Name</strong>: {items[0].name}</li>
                    <li><strong>Memory</strong>: {items[0].quote}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryDetailsPage;
