import React, { useState, useEffect, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileDrop from '../components/FileDrop';

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

const PortfolioComponent = () => {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioData | null>(null);
  const [newPortfolioFiles, setNewPortfolioFiles] = useState<File[]>([]);
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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

  const handlePortfolioEditChange = (field: keyof PortfolioData, value: string) => {
    if (editingPortfolio) {
      const updatedValue = field === 'technologies' ? value.split(',').map(tech => tech.trim()) : value;
      setEditingPortfolio(prev => ({ ...prev!, [field]: updatedValue }));
    }
  };

  const handleNewPortfolioFileChange = (files: File[]) => {
    setNewPortfolioFiles(files);
  };

  const handleRemovePortfolioImage = (index: number) => {
    if (editingPortfolio && editingPortfolio.imageUrls) {
      const updatedImageUrls = editingPortfolio.imageUrls.filter((_, idx) => idx !== index);
      setEditingPortfolio(prev => ({ ...prev!, imageUrls: updatedImageUrls }));
    }
  };

  const handleSubmitPortfolio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let updatedImageUrls = editingPortfolio ? [...editingPortfolio.imageUrls] : [];

    if (newPortfolioFiles.length > 0) {
      const formData = new FormData();
      newPortfolioFiles.forEach(file => formData.append('files', file, file.name));

      const uploadResponse = await axiosInstance.post('uploads/upload/portfolio', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      if (uploadResponse.data.fileUrls) {
        updatedImageUrls = [...updatedImageUrls, ...uploadResponse.data.fileUrls];
      }
    }

    const updatedPortfolioData = {
      ...editingPortfolio!,
      imageUrls: updatedImageUrls,
    };

    try {
      if (editingPortfolio?._id) {
        await axiosInstance.put(`/portfolio/update/${editingPortfolio._id}`, updatedPortfolioData);
      } else {
        await axiosInstance.post('/portfolio/add', updatedPortfolioData);
      }

      setPortfolios([...portfolios.filter(p => p._id !== editingPortfolio?._id), updatedPortfolioData]);
      setEditingPortfolio(null);
      setNewPortfolioFiles([]);
      setIsCreatingPortfolio(false);

      handleSuccessToast('Portfolio updated successfully');
    } catch (error) {
      setError('Failed to update portfolio');
      handleErrorToast('Failed to update portfolio');
    }
    setLoading(false);
  };

  const handleDeletePortfolio = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/portfolio/delete/${id}`);
      setPortfolios(prevPortfolios => prevPortfolios.filter(portfolio => portfolio._id !== id));
      handleSuccessToast('Portfolio deleted successfully');
    } catch (error) {
      setError('Failed to delete portfolio');
      handleErrorToast('Failed to delete portfolio');
    }
    setLoading(false);
  };

  const handlePortfolioCancel = () => {
    setEditingPortfolio(null);
    setNewPortfolioFiles([]);
    setIsCreatingPortfolio(false);
  };

  const startCreatingPortfolio = () => {
    setEditingPortfolio({
      _id:'',
      title: '',
      category: '',
      imageUrls: [],
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      role: '',
      githubUrl: '',
      liveDemoUrl: '',
    });
    setNewPortfolioFiles([]);
    setIsCreatingPortfolio(true);
  };

  const handleSuccessToast = (message: string) => {
    toast.success(message);
  };

  const handleErrorToast = (message: string) => {
    toast.error(message);
  };

  return (
    <div>
      <h2>Portfolio Section</h2>
      <form onSubmit={handleSubmitPortfolio}>
        <input name="category" value={editingPortfolio?.category || ''} onChange={e => handlePortfolioEditChange('category', e.target.value)} placeholder="Category" required />
        <input type="text" value={editingPortfolio?.title || ''} onChange={e => handlePortfolioEditChange('title', e.target.value)} placeholder="Title" required />
        <textarea value={editingPortfolio?.description || ''} onChange={e => handlePortfolioEditChange('description', e.target.value)} placeholder="Description" />
        <input type="text" value={editingPortfolio?.technologies.join(', ') || ''} onChange={e => handlePortfolioEditChange('technologies', e.target.value)} placeholder="Technologies (comma-separated)" />
        <input type="date" value={editingPortfolio?.startDate || ''} onChange={e => handlePortfolioEditChange('startDate', e.target.value)} placeholder="Start Date" />
        <input type="date" value={editingPortfolio?.endDate || ''} onChange={e => handlePortfolioEditChange('endDate', e.target.value)} placeholder="End Date" />
        <input
          type="text"
          value={editingPortfolio?.role || ''}
          onChange={e => handlePortfolioEditChange('role', e.target.value)}
          placeholder="Role"
          required
        />
        <input type="url" value={editingPortfolio?.githubUrl || ''} onChange={e => handlePortfolioEditChange('githubUrl', e.target.value)} placeholder="GitHub URL" />
        <input type="url" value={editingPortfolio?.liveDemoUrl || ''} onChange={e => handlePortfolioEditChange('liveDemoUrl', e.target.value)} placeholder="Live Demo URL" />
        <FileDrop onDrop={handleNewPortfolioFileChange} />
        {newPortfolioFiles.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
          </div>
        ))}
        {editingPortfolio?.imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Portfolio ${index}`} style={{ width: '100px', height: '100px' }} />
            <button type="button" onClick={() => handleRemovePortfolioImage(index)}>Remove</button>
          </div>
        ))}
        <button type="submit">{isCreatingPortfolio ? 'Create' : 'Save'}</button>
        <button type="button" onClick={handlePortfolioCancel}>Cancel</button>
      </form>
  
      {/* Display portfolios */}
      {portfolios.map((portfolio) => (
        <div key={portfolio._id}>
          <h3>{portfolio.title}</h3>
          <p><strong>Category:</strong> {portfolio.category}</p>
          <p><strong>Description:</strong> {portfolio.description}</p>
          <p><strong>Technologies:</strong> {portfolio.technologies.join(', ')}</p>
          <p><strong>Start Date:</strong> {portfolio.startDate}</p>
          <p><strong>End Date:</strong> {portfolio.endDate}</p>
          <p><strong>Role:</strong> {portfolio.role}</p>
          <p><strong>GitHub URL:</strong> <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer">{portfolio.githubUrl}</a></p>
          <p><strong>Live Demo URL:</strong> <a href={portfolio.liveDemoUrl} target="_blank" rel="noopener noreferrer">{portfolio.liveDemoUrl}</a></p>
          {portfolio.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`${portfolio.title}  ${index + 1}`} style={{ width: '100px', height: '100px' }} />
          ))}
          <button onClick={() => setEditingPortfolio(portfolio)}>Edit</button>
          <button onClick={() => handleDeletePortfolio(portfolio._id)}>Delete</button>
        </div>
      ))}
  
      {/* Button to create new portfolio */}
      <button onClick={startCreatingPortfolio}>Create New Portfolio</button>
  
      {/* Loading and error messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
}  

export default PortfolioComponent;
