import React from 'react';
import { Link } from 'react-router-dom';

interface PortfolioItemProps {
  category: string;
  imageUrl: string;
  title: string;
  likes: number;
  onLike: () => void;
  id: string;
}

const PortfolioItem = ({ category, imageUrl, title, likes, onLike, id }: PortfolioItemProps) => {
  return (
    <div className={`col-lg-4 col-md-6 portfolio-item filter-${category}`}>
      <div className="portfolio-wrap">
        <img src={imageUrl} className="img-fluid" alt={title} />
        <div className="portfolio-links">
          <button onClick={onLike} title="Like this" className="portfolio-action" >
            <i className="bx bx-plus"></i>
            <span> {likes} Likes</span>
          </button>
          <Link to={`/portfolio/${title}`} title="More Details" className="portfolio-action">
            <i className="bx bx-link"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default PortfolioItem;
