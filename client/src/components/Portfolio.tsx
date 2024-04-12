import React, { useEffect, useState } from 'react';
// import Isotope from 'isotope-layout';
// import GLightbox from 'glightbox';
// import Swiper from 'swiper';
// import 'glightbox/dist/css/glightbox.css';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import PortfolioItem from './PortfolioItem';


// function Portfolio() {
//   // 假设这是从API或其他地方获取的项目数据
//   const [projects, setProjects] = useState([
//     // 示例项目数据
//     {
//       id: 1,
//       category: 'app',
//       imageUrl: '/path/to/image-1.jpg',
//       largeImageUrl: '/path/to/large-image-1.jpg',
//       projectLink: '/path/to/project-1',
//       title: 'Project 1'
//     },
//     // 添加更多项目...
//   ]);

//   useEffect(() => {
//     let portfolioIsotope = new Isotope('.portfolio-container', {
//       itemSelector: '.portfolio-item',
//       layoutMode: 'fitRows'
//     });

//     const portfolioLightbox = GLightbox({ selector: '.portfolio-lightbox' });

//     new Swiper('.portfolio-details-slider', { /* 配置 */ });
//     new Swiper('.testimonials-slider', { /* 配置 */ });

//     document.querySelectorAll('#portfolio-flters li').forEach(filter => {
//       filter.addEventListener('click', () => {
//         if (!portfolioIsotope) return;
//         const filterValue = filter.getAttribute('data-filter') || '*';
//         portfolioIsotope.arrange({ filter: filterValue });
//       });
//     });

//     return () => {
//       portfolioIsotope?.destroy();
//       portfolioLightbox?.close();
//     };
//   }, []);

//   return (
//     <section id="portfolio" className="portfolio section-bg">
//       <div className="container">
//         {/* 省略其他静态内容 */}
//         <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="100">
//           {projects.map(project => (
//             <PortfolioItem key={project.id} {...project} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Portfolio;
