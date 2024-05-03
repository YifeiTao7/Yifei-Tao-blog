import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios.config';


interface Fact {
  icon: string;
  title: string;
  count: number;
  description: string;
}

const Facts = () => {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [counts, setCounts] = useState<{ [key: number]: number }>({});

  const initializeCounts = (facts: Fact[]) => {
    facts.forEach((fact, index) => {
      let start = 0;
      const end = fact.count;
      const duration = 2000;
      const incrementTime = (duration / end) * Math.random();

      const interval = setInterval(() => {
        start += 1;
        setCounts(prevCounts => ({ ...prevCounts, [index]: start }));
        if (start === end) clearInterval(interval);
      }, incrementTime);
    });
  };


  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await axiosInstance.get('/statistics');
        setFacts(response.data);
        initializeCounts(response.data);
      } catch (error) {
        console.error('Failed to fetch facts:', error);
      }
    };

    fetchFacts();
  }, []);

  return (
    <section id="facts" className="facts">
      <div className="container">
        <div className="section-title">
          <h2>Facts</h2>
        </div>
        <div className="row no-gutters">
          {facts.map((fact, index) => (
            <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch" key={index} data-aos="fade-up">
              <div className="count-box">
                <i className={`bi ${fact.icon}`}></i>
                <span>{counts[index] ?? 0}</span>
                <p><strong>{fact.title}</strong> {fact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facts;
