import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Isotope from 'isotope-layout';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import PortfolioItem from './PortfolioItem';
import axiosInstance from '../axios.config';

interface Project {
    _id: string;
    category: string;
    imageUrls: string[];
    title: string;
    likes: number;
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
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchData();
        AOS.init({ duration: 1000, once: true });
    }, []);

    useLayoutEffect(() => {
        if (projectsFetched && isoRef.current) {
            const observer = new MutationObserver(() => {
                if (isotope.current) {
                    isotope.current.layout();
                }
            });

            observer.observe(isoRef.current, {
                childList: true,
                subtree: true,
                attributes: true
            });

            isotope.current = new Isotope(isoRef.current, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            const lightbox = GLightbox({
                selector: '.glightbox'
            });

            return () => {
                observer.disconnect();
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

    const handleLike = async (projectId: string) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axiosInstance.post(`/portfolio/${projectId}/like`);
            const updatedProjects = projects.map(project => {
                if (project._id === projectId) {
                    return { ...project, likes: project.likes + 1 };
                }
                return project;
            });
            setProjects(updatedProjects);
        } catch (error) {
            console.error('Failed to like project:', error);
        }
    };

    return (
        <section id="portfolio" className="portfolio section-bg">
            <div className="container">
                <div className="section-title">
                    <h2>Portfolio</h2>
                </div>
                <div className="row" data-aos="fade-up">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="portfolio-flters">
                            <li className={filterKey === '*' ? 'filter-active' : ''} onClick={() => setFilterKey('*')}>All</li>
                            <li className={filterKey === 'personal' ? 'filter-active' : ''} onClick={() => setFilterKey('personal')}>Personal Projects</li>
                            <li className={filterKey === 'professional' ? 'filter-active' : ''} onClick={() => setFilterKey('professional')}>Professional Projects</li>
                            <li className={filterKey === 'school' ? 'filter-active' : ''} onClick={() => setFilterKey('school')}>School Projects</li>
                        </ul>
                    </div>
                </div>
                <div className="row portfolio-container" ref={isoRef} data-aos="fade-up" data-aos-delay="100">
                    {projects.map(project => (
                        <PortfolioItem
                            key={project._id}
                            category={project.category}
                            imageUrl={process.env.PUBLIC_URL + (project.imageUrls.length > 0 ? project.imageUrls[0] : '')}
                            title={project.title}
                            likes={project.likes}
                            onLike={() => handleLike(project._id)}
                            id={project._id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
