import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Skill {
  name: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Database';
  active: boolean;
}

const initialSkills: Skill[] = [
  { name: "HTML", icon: "bi-file-earmark-code", category: "Frontend", active: false },
  { name: "CSS", icon: "bi-palette", category: "Frontend", active: false },
  { name: "JavaScript", icon: "bi-lightning", category: "Frontend", active: false },
  { name: "TypeScript", icon: "bi-file-earmark-code", category: "Frontend", active: false },
  {name: "React", icon: "bi-stars", category: "Frontend", active: false}, 
  { name: "Next.js", icon: "bi-globe", category: "Frontend", active: false },
  { name: "Node.js", icon: "bi-server", category: "Backend", active: false },
  { name: "Java", icon: "bi-cup", category: "Backend", active: false },
  {name: "Python", icon: "bi-braces", category: "Backend",active: false}, 
  { name: "GraphQL", icon: "bi-diagram-3", category: "Database", active: false },
  { name: "Bootstrap", icon: "bi-bootstrap", category: "Frontend", active: false },
  { name: "Docker", icon: "bi-box-seam", category: "Backend", active: false },
  { name: "Express", icon: "bi-terminal", category: "Backend", active: false },
  { name: "MongoDB", icon: "bi-hdd-rack", category: "Database", active: false },
];
const useSkillAnimation = (initialSkills: Skill[], color: string) => {
  const [skills, setSkills] = useState<Skill[]>(() =>
    initialSkills.map((skill, index) => ({
      ...skill,
      active: index === 0,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSkills((prevSkills) => {
        const activeIndex = prevSkills.findIndex((s) => s.active);
        const nextIndex = (activeIndex + 1) % prevSkills.length;
        return prevSkills.map((skill, index) => ({
          ...skill,
          active: index === nextIndex,
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSkills.length]);

  return { skills, color };
};

const SkillCard = ({ title, skills, color }: { title: string; skills: Skill[]; color: string }) => (
  <div className="card skill-card">
    <h5 className="card-header" style={{ backgroundColor: color }}>{title}</h5>
    <div className="card-body">
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className={`skill ${skill.active ? 'active' : ''}`} style={{ borderColor: color }}>
            <i className={`bi ${skill.icon}`} style={{ color: skill.active ? color : '' }}></i>
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Skills = () => {
  const frontend = useSkillAnimation(initialSkills.filter((skill) => skill.category === 'Frontend'), '#ff4757');
  const backend = useSkillAnimation(initialSkills.filter((skill) => skill.category === 'Backend'), '#1e90ff');
  const database = useSkillAnimation(initialSkills.filter((skill) => skill.category === 'Database'), '#ff7f50');

  return (
    <div className="container">
      <div className="row">
        <div className="col"><SkillCard title="Frontend Skills" {...frontend} /></div>
        <div className="col"><SkillCard title="Backend Skills" {...backend} /></div>
        <div className="col"><SkillCard title="Database Skills" {...database} /></div>
      </div>
    </div>
  );
};

export default Skills;
