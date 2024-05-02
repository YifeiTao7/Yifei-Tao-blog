import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import FileDrop from '../components/FileDrop';

interface PortfolioData {
  _id?: string;
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

const AdminPage = () => {
  const [mode, setMode] = useState<'portfolio' | 'life'>('portfolio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioData | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false); // Track if creating new portfolio

  const fetchPortfolios = async () => {
    try {
      const response = await axiosInstance.get<PortfolioData[]>('/portfolio/all');
      setPortfolios(response.data);
    } catch (error) {
      setError('Failed to fetch portfolios');
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleEditChange = (field: keyof PortfolioData, value: string) => {
    if (editingPortfolio) {
      const updatedValue = field === 'technologies' ? value.split(',').map(tech => tech.trim()) : value;
      setEditingPortfolio(prev => ({ ...prev!, [field]: updatedValue }));
    }
  };
  
  const handleNewFileChange = (files: File[]) => {
    setNewFiles(files);
  };

  const handleRemoveImage = (index: number) => {
    if (editingPortfolio && editingPortfolio.imageUrls) {
      const updatedImageUrls = editingPortfolio.imageUrls.filter((_, idx) => idx !== index);
      setEditingPortfolio({ ...editingPortfolio, imageUrls: updatedImageUrls });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      let updatedImageUrls: string[] = editingPortfolio ? [...editingPortfolio.imageUrls] : [];

      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append('files', file, file.name);
        });

        const uploadResponse = await axiosInstance.post('/upload/portfolio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data.fileUrls) {
          updatedImageUrls = [...updatedImageUrls, ...uploadResponse.data.fileUrls];
        }
      }

      const updatedPortfolioData = {
        ...editingPortfolio!,
        imageUrls: updatedImageUrls,
      };

      if (editingPortfolio?._id) {
        await axiosInstance.put(`/portfolio/update/${editingPortfolio._id}`, updatedPortfolioData);
      } else {
        await axiosInstance.post('/portfolio/add', updatedPortfolioData); // Use /add route for creating new portfolio
      }

      fetchPortfolios();
      setEditingPortfolio(null);
      setNewFiles([]);
      setLoading(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error during file upload or project update:', error);
      setError('Failed to update portfolio');
      setLoading(false);
    }
  };

  const startEditing = (portfolio: PortfolioData) => {
    setEditingPortfolio({ ...portfolio });
    setNewFiles([]); // 清空新文件
    setIsCreating(false);
  };
  

  const startCreating = () => {
    setEditingPortfolio({
      title: '', 
      category: '',
      imageUrls: [],
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      role: '',
      githubUrl: '',
      liveDemoUrl: ''
    });
    setNewFiles([]);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingPortfolio(null);
    setNewFiles([]);
    setIsCreating(false);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <button onClick={() => setMode('portfolio')}>Portfolio Mode</button>
        <button onClick={() => setMode('life')}>Life Mode</button>
      </div>

      <form onSubmit={handleSubmit}>
  <input name="category" value={editingPortfolio?.category || ''} onChange={e => handleEditChange('category', e.target.value)} placeholder="Category" required />
  <input type="text" value={editingPortfolio?.title || ''} onChange={e => handleEditChange('title', e.target.value)} placeholder="Title" required />
  <textarea value={editingPortfolio?.description || ''} onChange={e => handleEditChange('description', e.target.value)} placeholder="Description" />
  <input type="text" value={editingPortfolio?.technologies.join(', ') || ''} onChange={e => handleEditChange('technologies', e.target.value)} placeholder="Technologies (comma-separated)" />
  <input type="date" value={editingPortfolio?.startDate || ''} onChange={e => handleEditChange('startDate', e.target.value)} placeholder="Start Date" />
  <input type="date" value={editingPortfolio?.endDate || ''} onChange={e => handleEditChange('endDate', e.target.value)} placeholder="End Date" />
  <input type="text" value={editingPortfolio?.role || ''} onChange={e => handleEditChange('role', e.target.value)} placeholder="Role" />
  <input type="url" value={editingPortfolio?.githubUrl || ''} onChange={e => handleEditChange('githubUrl', e.target.value)} placeholder="GitHub URL" />
  <input type="url" value={editingPortfolio?.liveDemoUrl || ''} onChange={e => handleEditChange('liveDemoUrl', e.target.value)} placeholder="Live Demo URL" />

  <FileDrop onDrop={handleNewFileChange} />

  {newFiles.map((file, index) => (
    <div key={index}>
      <p>{file.name}</p>
    </div>
  ))}

  {editingPortfolio?.imageUrls.map((url, index) => (
    <div key={index}>
      <img src={url} alt={`Portfolio Image ${index}`} style={{ width: '100px', height: '100px' }} />
      <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
    </div>
  ))}

  <button type="submit">{isCreating ? 'Create' : 'Save'}</button>
  <button type="button" onClick={handleCancel}>Cancel</button>
</form>


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h1>Portfolio List</h1>
        {portfolios.map((portfolio) => (
          <div key={portfolio._id}>
            <h3>{portfolio.title}</h3>
            <p>{portfolio.description}</p>
            <button onClick={() => startEditing(portfolio)}>Edit</button>
          </div>
        ))}
        <button onClick={startCreating}>Create New Portfolio</button>
      </div>
    </div>
  );
};

export default AdminPage;
