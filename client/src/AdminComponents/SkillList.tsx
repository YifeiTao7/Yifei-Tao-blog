import React, { useState, useEffect, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SkillData {
  _id: string;
  category: string;
  icon: string;
  name: string;
}

const SkillList = () => {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get<SkillData[]>('/skills');
        setSkills(response.data);
      } catch (error) {
        setError('Failed to fetch skills');
        toast.error('Failed to fetch skills');
      }
    };

    fetchSkills();
  }, []);

  const handleSkillEditChange = (field: keyof SkillData, value: string) => {
    if (editingSkill) {
      setEditingSkill(prev => {
        if (prev === null) return null;
        const updatedSkill: SkillData = { ...prev, [field]: value };
        return updatedSkill;
      });
    }
  };
  

  const handleSubmitSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const skillData = { ...editingSkill } as SkillData;

    try {
      if (editingSkill && editingSkill._id) {
        const updatedSkill = await axiosInstance.patch<SkillData>(`/skills/${editingSkill._id}`, skillData);
        toast.success('Skill updated successfully!');
        setSkills(prevItems => prevItems.map(item => item._id === editingSkill._id ? updatedSkill.data : item));
      } else {
        const newSkill = await axiosInstance.post<SkillData>('/skills/', skillData);
        toast.success('Skill created successfully!');
        setSkills(prevItems => [...prevItems, newSkill.data]);
      }

      setEditingSkill(null);
      setIsCreatingSkill(false);
    } catch (error) {
      console.error('Error during skill update:', error);
      setError('Failed to update skill');
      toast.error('Failed to update skill');
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/skills/${id}`);
      setSkills(skills.filter(item => item._id !== id));
      toast.success('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill');
      toast.error('Failed to delete skill');
    }
    setLoading(false);
  };

  const handleSkillCancel = () => {
    setEditingSkill(null);
    setIsCreatingSkill(false);
  };

  const startCreatingSkill = () => {
    setEditingSkill({ _id: '', category: '', icon: '', name: '' });
    setIsCreatingSkill(true);
  };

  return (
    <div>
      <h2>Skills Section</h2>
      <form onSubmit={handleSubmitSkill}>
        <input
          type="text"
          value={editingSkill?.category || ''}
          onChange={e => handleSkillEditChange('category', e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="text"
          value={editingSkill?.name || ''}
          onChange={e => handleSkillEditChange('name', e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={editingSkill?.icon || ''}
          onChange={e => handleSkillEditChange('icon', e.target.value)}
          placeholder="Bootstrap icon class (e.g., bi-palette)"
          required
        />
        <button type="submit">{isCreatingSkill ? 'Create' : 'Save'}</button>
        <button type="button" onClick={handleSkillCancel}>Cancel</button>
      </form>
      {skills.map((skill) => (
        <div key={skill._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{skill.name}</h3>
          <i className={`bi ${skill.icon}`} style={{ fontSize: '24px' }}></i>
          <button onClick={() => setEditingSkill(skill)}>Edit</button>
          <button onClick={() => handleDeleteSkill(skill._id)}>Delete</button>
        </div>
      ))}
      <button onClick={startCreatingSkill}>Create New Skill</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ToastContainer />
    </div>
  );
};

export default SkillList;
