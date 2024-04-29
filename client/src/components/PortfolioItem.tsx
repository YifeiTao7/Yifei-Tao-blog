import React from 'react';
import { Link } from 'react-router-dom';

interface PortfolioItemProps {
  category: string;
  imageUrl: string;
  title: string;
}

const PortfolioItem = ({ category, imageUrl, title }: PortfolioItemProps) => {
  return (
    <div className={`col-lg-4 col-md-6 portfolio-item filter-${category}`}>
      <div className="portfolio-wrap">
        <img src={imageUrl} className="img-fluid" alt={title} />
        <div className="portfolio-links">
          <a href={imageUrl} data-gallery="portfolioGallery" className="portfolio-lightbox" title={title}>
            <i className="bx bx-plus"></i>
          </a>
          <Link to={`/portfolio/${title}`} title="More Details">
            <i className="bx bx-link"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
