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
  const [newFile, setNewFile] = useState<File | null>(null);

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
      const updatedValue = field === 'technologies' ? value.split(',').map(tech => tech.trim()) : value;
      setEditingPortfolio({ ...editingPortfolio, [field]: updatedValue });
    }
  };

  const handleNewFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewFile(event.target.files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (editingPortfolio && editingPortfolio.imageUrls) {
      const updatedImageUrls = editingPortfolio.imageUrls.filter((_, idx) => idx !== index);
      setEditingPortfolio({ ...editingPortfolio, imageUrls: updatedImageUrls });
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!editingPortfolio) return;
  
    const formData = new FormData();
    if (newFile) {
      formData.append('files', newFile);
    }
  
    try {
      const uploadResponse = await axiosInstance.post('/upload/portfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.data.fileUrls) {
        const updatedImageUrls = [...editingPortfolio.imageUrls, ...uploadResponse.data.fileUrls];
        const updatedPortfolioData = {
          ...editingPortfolio,
          imageUrls: updatedImageUrls
        };

        const updateResponse = await axiosInstance.put(`/portfolio/update/${editingPortfolio._id}`, updatedPortfolioData);

        if (updateResponse.status === 200) {
          // 重新获取更新后的项目列表
          fetchPortfolios(); // 调用已有的 fetchPortfolios 函数重新加载数据
          setEditingPortfolio(null);
          setNewFile(null);
        }
      }
    } catch (error) {
      console.error('Error during file upload or project update:', error);
      setError('Failed to update portfolio');
    }
};

// fetchPortfolios 函数保持不变，确保它可以被 handleSubmit 调用
const fetchPortfolios = async () => {
    try {
      const response = await axiosInstance.get<PortfolioData[]>('/portfolio/all');
      setPortfolios(response.data);
    } catch (error) {
      setError('Failed to fetch portfolios');
    }
};

  

  const startEditing = (portfolio: PortfolioData) => {
    setEditingPortfolio({...portfolio}); // Copy the portfolio data to state
    setNewFile(null); // Reset new file
  };

  const handleCancel = () => {
    setEditingPortfolio(null);
    setNewFile(null);
  };

  return (
    <div>
      <h1>Portfolio List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {portfolios.map((portfolio) => (
        editingPortfolio?._id === portfolio._id ? (
          <form onSubmit={handleSubmit} key={portfolio._id}>
            <input type="text" value={editingPortfolio.title || ''} onChange={e => handleEditChange('title', e.target.value)} required />
            <input type="text" value={editingPortfolio.category || ''} onChange={e => handleEditChange('category', e.target.value)} />
            <textarea value={editingPortfolio.description || ''} onChange={e => handleEditChange('description', e.target.value)} />
            <input type="text" value={editingPortfolio.technologies.join(', ') || ''} onChange={e => handleEditChange('technologies', e.target.value)} />
            <input type="date" value={editingPortfolio.startDate ? new Date(editingPortfolio.startDate).toISOString().slice(0, 10) : ''} onChange={e => handleEditChange('startDate', e.target.value)} />
            <input type="date" value={editingPortfolio.endDate ? new Date(editingPortfolio.endDate).toISOString().slice(0, 10) : ''} onChange={e => handleEditChange('endDate', e.target.value)} />
            <input type="text" value={editingPortfolio.role || ''} onChange={e => handleEditChange('role', e.target.value)} />
            <input type="url" value={editingPortfolio.githubUrl || ''} onChange={e => handleEditChange('githubUrl', e.target.value)} />
            <input type="url" value={editingPortfolio.liveDemoUrl || ''} onChange={e => handleEditChange('liveDemoUrl', e.target.value)} />

            <input type="file" onChange={handleNewFileChange} />
            {newFile && (
              <img src={URL.createObjectURL(newFile)} alt="New File Preview" style={{ width: '100px', height: '100px' }} onLoad={() => URL.revokeObjectURL(URL.createObjectURL(newFile))} />
            )}
            {editingPortfolio.imageUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Portfolio Image ${index}`} style={{ width: '100px', height: '100px' }} />
                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
              </div>
            ))}
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
