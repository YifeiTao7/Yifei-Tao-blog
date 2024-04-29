import React, { useEffect, useState } from 'react';

interface Fact {
  icon: string;
  title: string;
  count: number;
  description: string;
}

const Facts = () => {
  const [facts, setFacts] = useState<Fact[]>([
    { icon: "bi-emoji-smile", title: "Happy Clients", count: 232, description: "consequuntur quae" },
    { icon: "bi-journal-richtext", title: "Projects", count: 521, description: "adipisci atque cum quia aut" },
    { icon: "bi-headset", title: "Hours Of Support", count: 1453, description: "aut commodi quaerat" },
    { icon: "bi-people", title: "Hard Workers", count: 32, description: "rerum asperiores dolor" },
  ]);

  const [counts, setCounts] = useState<{ [key: number]: number }>({});

  // 动画计数效果
  useEffect(() => {
    facts.forEach((fact, index) => {
      let start = 0;
      const end = fact.count;
      const duration = 2000; // 动画持续时间，单位为毫秒
      const incrementTime = (duration / end) * Math.random(); // 计算每次增加的时间间隔

      const interval = setInterval(() => {
        start += 1;
        setCounts(prevCounts => ({ ...prevCounts, [index]: start }));
        if (start === end) clearInterval(interval);
      }, incrementTime);
    });
  }, [facts]); // 依赖项数组中包含facts，确保每次facts更新时都会重新运行动画

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
