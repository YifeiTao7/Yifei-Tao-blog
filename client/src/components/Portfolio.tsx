import React, { useEffect, useState, useRef } from 'react';
import Isotope from 'isotope-layout';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import PortfolioItem from './PortfolioItem';
import axiosInstance from '../axios.config'; // 确保路径正确

interface Project {
    id: number;
    category: string;  // 'personal', 'professional', 'school'
    imageUrls: string[];
    title: string;
}

const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const isoRef = useRef<HTMLDivElement | null>(null);
    const isotope = useRef<Isotope | null>(null);
    const [projectsFetched, setProjectsFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/portfolio/all');
                setProjects(response.data);
                setProjectsFetched(true);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchData();
        AOS.init({ duration: 1000, once: true });
    
        return () => {
            // Clean up
        };
    }, []);

    useEffect(() => {
        if (projectsFetched && isoRef.current) {
            isotope.current = new Isotope(isoRef.current, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            const lightbox = GLightbox({
                selector: '.glightbox'
            });

            isotope.current.layout();
            return () => {
                isotope.current?.destroy();
                lightbox.close();
            };
        }
    }, [projectsFetched]);

    useEffect(() => {
        if (projectsFetched && isotope.current) {
            isotope.current.layout();
        }
    }, [projects, projectsFetched]);

    const [filterKey, setFilterKey] = useState('*');
    useEffect(() => {
        if (isotope.current) {
            const filterValue = filterKey === '*' ? '*' : `.${filterKey}`;
            isotope.current.arrange({ filter: filterValue });
        }
    }, [filterKey]);

    return (
        <section id="portfolio" className="portfolio section-bg">
            <div className="container">
                <div className="section-title">
                    <h2>Portfolio</h2>
                    <p>These are the projects I have been fortunate enough to participate in and the results of my work</p>
                </div>
                <div className="row" data-aos="fade-up">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="portfolio-flters">
                            <li className={filterKey === '*' ? 'filter-active' : ''} onClick={() => setFilterKey('*')}>All</li>
                            <li className={filterKey === 'personal' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-personal')}>Personal Projects</li>
                            <li className={filterKey === 'professional' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-professional')}>Professional Projects</li>
                            <li className={filterKey === 'school' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-school')}>School Projects</li>
                        </ul>
                    </div>
                </div>
                <div className="row portfolio-container" ref={isoRef} data-aos="fade-up" data-aos-delay="100">
                    {projects.map(project => (
                        <PortfolioItem
                            key={project.id}
                            category={project.category}
                            imageUrl={process.env.PUBLIC_URL + (project.imageUrls.length > 0 ? project.imageUrls[0] : '')}
                            title={project.title}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
