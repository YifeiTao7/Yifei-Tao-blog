// PortfolioItem.tsx
import React from 'react';

interface PortfolioItemProps {
  category: string;
  imageUrl: string;
  title: string;
  projectDetailsUrl: string;
}

const PortfolioItem = ({ category, imageUrl, title, projectDetailsUrl }: PortfolioItemProps) => {
  return (
    <div className={`col-lg-4 col-md-6 portfolio-item filter-${category}`}>
      <div className="portfolio-wrap">
        <img src={imageUrl} className="img-fluid" alt={title} />
        <div className="portfolio-links">
          <a href={imageUrl} data-gallery="portfolioGallery" className="portfolio-lightbox" title={title}>
            <i className="bx bx-plus"></i>
          </a>
          <a href={projectDetailsUrl} title="More Details">
            <i className="bx bx-link"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
