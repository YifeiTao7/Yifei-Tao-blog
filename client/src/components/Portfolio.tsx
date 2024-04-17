import React, { useEffect, useState, useRef } from 'react';
import Isotope from 'isotope-layout';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PortfolioItem from './PortfolioItem';
import axiosInstance from '../axios.config'; // 导入自定义的axios实例，确保路径正确

interface Project {
    id: number;
    category: string;
    imageUrl: string;
    title: string;
    projectDetailsUrl: string;
}

const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const isoRef = useRef<HTMLDivElement | null>(null);
    const isotope = useRef<Isotope | null>(null);
    const [projectsFetched, setProjectsFetched] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/portfolio/all');
                setProjects(response.data);
                setProjectsFetched(true); // 设置状态为已获取数据
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
    
        fetchData();
        AOS.init({ duration: 1000, once: true });
    
        return () => {
            // 清理操作
        };
    }, []);
    
    useEffect(() => {
        // 当项目加载完成后且容器存在时才初始化 Isotope
        if (projectsFetched && isoRef.current) {
            isotope.current = new Isotope(isoRef.current, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });
    
            const lightbox = GLightbox({
                selector: '.glightbox'
            });
            isotope.current.layout(); // 手动触发 Isotope 的布局
            return () => {
                isotope.current?.destroy();
                lightbox.close();
            };
        }
    }, [projectsFetched]);
    
    useEffect(() => {
        // 当项目状态发生变化时，手动触发 Isotope 的布局
        if (projectsFetched && isotope.current) {
            isotope.current.layout();
        }
    }, [projects, projectsFetched]);
    
    
    
    

    const [filterKey, setFilterKey] = useState('*');
    useEffect(() => {
        if (isotope.current) {
            // 将 filterKey 转换为选择器字符串
            const filterValue = filterKey === '*' ? '*' : `.${filterKey}`;
            isotope.current.arrange({ filter: filterValue }); // 将 filterValue 作为参数传递给 arrange 方法
        }
    }, [filterKey]);


    return (
        <section id="portfolio" className="portfolio section-bg">
            <div className="container">
                <div className="section-title">
                    <h2>Portfolio</h2>
                    <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem...</p>
                </div>
                <div className="row" data-aos="fade-up">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="portfolio-flters">
                            <li className={filterKey === '*' ? 'filter-active' : ''} onClick={() => setFilterKey('*')}>All</li>
                            <li className={filterKey === 'app' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-app')}>App</li>
                            <li className={filterKey === 'card' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-card')}>Card</li>
                            <li className={filterKey === 'web' ? 'filter-active' : ''} onClick={() => setFilterKey('filter-web')}>Web</li>
                        </ul>
                    </div>
                </div>
                <div className="row portfolio-container" ref={isoRef} data-aos="fade-up" data-aos-delay="100">
                    {projects.map(project => (
                        <PortfolioItem
                            key={project.id}
                            category={project.category}
                            imageUrl={project.imageUrl}
                            title={project.title}
                            projectDetailsUrl={project.projectDetailsUrl}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
