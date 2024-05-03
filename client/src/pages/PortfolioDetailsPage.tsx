import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios.config';
import { useParams, Link } from 'react-router-dom';

interface PortfolioItem {
  id: number;
  imageUrls: string[];
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  role: string;
  githubUrl?: string;
  liveDemoUrl?: string;
}

type Params = {
  title: string;
}

const PortfolioDetailsPage = () => {
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { title } = useParams<Params>();

  useEffect(() => {
    setLoading(true);
    const fetchPortfolioItem = async () => {
      try {
        const response = await axiosInstance.get<PortfolioItem[]>(`/portfolio/${title}`);
        if (response.data.length > 0) {
          setPortfolioItem(response.data[0]);
          setError(null);
        } else {
          setError('Portfolio item not found');
        }
      } catch (error) {
        setError('Failed to fetch portfolio item');
        console.error('Failed to fetch portfolio item:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolioItem();
  }, [title]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!portfolioItem) return <div>No Portfolio Item Found</div>;

  return (
    <main id="main">
      <section id="breadcrumbs" className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Portfolio Details</h2>
            <ol>
              <li><Link to="/">Home</Link></li>
              <li>Portfolio Details</li>
            </ol>
          </div>
        </div>
      </section>
      <section id="portfolio-details" className="portfolio-details">
        <div className="container">
          <div id="portfolioCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {portfolioItem.imageUrls.map((url, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img src={url} className="d-block w-100" alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>
            <a className="carousel-control-prev" href="#portfolioCarousel" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#portfolioCarousel" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </a>
          </div>

          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="portfolio-description">
                <h3>{portfolioItem.title}</h3>
                <p>{portfolioItem.description}</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-info">
                <h3>Project Details</h3>
                <ul>
                  <li><strong>Start Date:</strong> {new Date(portfolioItem.startDate).toLocaleDateString()}</li>
                  <li><strong>End Date:</strong> {new Date(portfolioItem.endDate).toLocaleDateString()}</li>
                  <li><strong>Role:</strong> {portfolioItem.role}</li>
                  <li><strong>Technologies Used:</strong></li>
                  {portfolioItem.technologies.map((technology, index) => (
                    <li key={index}>{technology}</li>
                  ))}
                  {portfolioItem.liveDemoUrl && <li><strong>Project URL:</strong> <a href={portfolioItem.liveDemoUrl} target="_blank" rel="noopener noreferrer">View Project</a></li>}
                  {portfolioItem.githubUrl && <li><strong>GitHub URL:</strong> <a href={portfolioItem.githubUrl} target="_blank" rel="noopener noreferrer">Source Code</a></li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PortfolioDetailsPage;
