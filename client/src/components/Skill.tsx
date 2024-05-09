import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios.config';

interface Skill {
  name: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud';
}

interface SkillCardProps {
  title: string;
  skills: Skill[];
  color: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ title, skills, color }) => {

  return (
    <div className="card skill-card">
      <h5 className="card-header" style={{ backgroundColor: color }}>{title}</h5>
      <div className="card-body">
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill" style={{ borderColor: color }}>
              <i className={`bi ${skill.icon}`} style={{ color: color }}></i>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [skills, setSkills] = useState<Skill[]>([]);
  const [frontendSkills, setFrontendSkills] = useState<Skill[]>([]);
  const [backendSkills, setBackendSkills] = useState<Skill[]>([]);
  const [databaseSkills, setDatabaseSkills] = useState<Skill[]>([]);
  const [cloudSkills, setCloudSkills] = useState<Skill[]>([]);

  useEffect(() => {
    axiosInstance.get<Skill[]>('/skills')
      .then(response => {
        console.log('Skills fetched from API:', response.data);
        setSkills(response.data);
        setFrontendSkills(response.data.filter(skill => skill.category === 'Frontend'));
        setBackendSkills(response.data.filter(skill => skill.category === 'Backend'));
        setDatabaseSkills(response.data.filter(skill => skill.category === 'Database'));
        setCloudSkills(response.data.filter(skill => skill.category === 'Cloud'));
      })
      .catch(error => {
        console.error('Failed to fetch skills', error);
      });
  }, []);

  return (
    <section id="skills" className="skills section-bg">
      <div className="container">
        <div className="row">
          <div className="col"><SkillCard title="Frontend Skills" skills={frontendSkills} color="#ff4757" /></div>
          <div className="col"><SkillCard title="Backend Skills" skills={backendSkills} color="#1e90ff" /></div>
          <div className="col"><SkillCard title="Database Skills" skills={databaseSkills} color="#ff7f50" /></div>
          <div className="col"><SkillCard title="Cloud Skills" skills={cloudSkills} color="#5F9EA0" /></div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
