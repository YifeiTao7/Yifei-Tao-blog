import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../axios.config';

interface PortfolioData {
  _id: string;
  title: string;
  category: string;
  imageUrls: string[];
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  role: string;
  githubUrl: string;
  liveDemoUrl: string;
}

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string>('');
  const [file, setFile] = useState<File | null>(null); // For storing the uploaded file

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axiosInstance.get<PortfolioData[]>('/portfolio/all');
        setPortfolios(response.data);
      } catch (error) {
        setError('Failed to fetch portfolios');
      }
    };

    fetchPortfolios();
  }, []);

  const handleEditChange = (field: keyof PortfolioData, value: string) => {
    if (editingPortfolio) {
      setEditingPortfolio({ ...editingPortfolio, [field]: value });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingPortfolio) return;

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('data', JSON.stringify(editingPortfolio));

    try {
      const response = await axiosInstance.put(`/portfolio/update/${editingPortfolio._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPortfolios(portfolios.map(p => p._id === editingPortfolio._id ? response.data : p));
      setEditingPortfolio(null);
      setFile(null);
    } catch (error) {
      setError('Failed to update portfolio');
    }
  };

  const startEditing = (portfolio: PortfolioData) => {
    setEditingPortfolio(portfolio);
  };

  const handleCancel = () => {
    setEditingPortfolio(null);
    setFile(null);
  };

  return (
    <div>
      <h1>Portfolio List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {portfolios.map(portfolio => (
        editingPortfolio?._id === portfolio._id ? (
          <form onSubmit={handleSubmit} key={portfolio._id}>
            <input type="text" value={editingPortfolio.title} onChange={e => handleEditChange('title', e.target.value)} required />
            <input type="text" value={editingPortfolio.role} onChange={e => handleEditChange('role', e.target.value)} />
            <input type="url" value={editingPortfolio.githubUrl} onChange={e => handleEditChange('githubUrl', e.target.value)} />
            <input type="url" value={editingPortfolio.liveDemoUrl} onChange={e => handleEditChange('liveDemoUrl', e.target.value)} />
            <textarea value={editingPortfolio.description} onChange={e => handleEditChange('description', e.target.value)} />
            <input type="text" value={editingPortfolio.technologies.join(',')} onChange={e => handleEditChange('technologies', e.target.value)} />
            <input type="file" onChange={handleFileChange} />
            {file && <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: 100, height: 100 }} />}
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </form>
        ) : (
          <div key={portfolio._id}>
            <h3>{portfolio.title}</h3>
            <p>{portfolio.description}</p>
            <button onClick={() => startEditing(portfolio)}>Edit</button>
          </div>
        )
      ))}
    </div>
  );
};

export default PortfolioList;
