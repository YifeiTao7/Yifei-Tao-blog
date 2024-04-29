import React, { useState } from 'react';
import axiosInstance from '../axios.config';  // Ensure the path is correct
import FileDrop from '../components/FileDrop';
import PortfolioList from '../AdminComponents/PortfolioList';

interface PortfolioData {
  category: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  role: string;
  githubUrl: string;
  liveDemoUrl: string;
  imageFiles: File[];
}

interface LifeData {
  category: string;
  name: string;
  quote: string;
  images: File[];
}

const AdminPage = () => {
  const [mode, setMode] = useState('portfolio');  // Toggle between 'portfolio' or 'life'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    category: '',
    title: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    role: '',
    githubUrl: '',
    liveDemoUrl: '',
    imageFiles: []
  });

  const [lifeData, setLifeData] = useState<LifeData>({
    category: '',
    name: '',
    quote: '',
    images: []
  });

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'technologies') {
      setPortfolioData({ ...portfolioData, [name]: value.split(',') });  // Splitting technologies by commas
    } else {
      setPortfolioData({ ...portfolioData, [name]: value });
    }
  };

  const handleLifeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLifeData({ ...lifeData, [name]: value });
  };

  const handleUpload = async (files: File[]): Promise<string[]> => {
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);  // 'files' needs to match server expectation
    });

    try {
      const response = await axiosInstance.post(`/upload/${mode}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileUrls;
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Error uploading files: ${error instanceof Error ? error.message : "Unknown error"}`);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'portfolio') {
      if (portfolioData.imageFiles.length === 0) {
        setError("No images selected for upload");
        return;
      }

      try {
        const imageUrls = await handleUpload(portfolioData.imageFiles);
        const portfolioPayload = { ...portfolioData, imageUrls };
        await axiosInstance.post('/portfolio/add', portfolioPayload);
        alert('Portfolio project added successfully!');
      } catch (error) {
        console.error('Failed to submit portfolio:', error);
        setError(`Failed to submit portfolio: ${error}`);
      }
    } else if (mode === 'life') {
      if (lifeData.images.length === 0) {
        setError("No images selected for upload");
        return;
      }

      try {
        const imageUrls = await handleUpload(lifeData.images);
        const lifePayload = { ...lifeData, image: imageUrls[0] };  // Assuming single image submission
        await axiosInstance.post('/life/add', lifePayload);
        alert('Life event added successfully!');
      } catch (error) {
        console.error('Failed to submit life data:', error);
        setError(`Failed to submit life data: ${error}`);
      }
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <button onClick={() => setMode('portfolio')}>Portfolio Mode</button>
        <button onClick={() => setMode('life')}>Life Mode</button>
      </div>

      <form onSubmit={submitForm}>
        {mode === 'portfolio' ? (
          <>
            <input name="category" value={portfolioData.category} onChange={handlePortfolioChange} placeholder="Category" />
            <input name="title" value={portfolioData.title} onChange={handlePortfolioChange} placeholder="Title" />
            <textarea name="description" value={portfolioData.description} onChange={handlePortfolioChange} placeholder="Description" />
            <input name="technologies" value={portfolioData.technologies.join(',')} onChange={handlePortfolioChange} placeholder="Technologies (comma-separated)" />
            <input name="startDate" type="date" value={portfolioData.startDate} onChange={handlePortfolioChange} />
            <input name="endDate" type="date" value={portfolioData.endDate} onChange={handlePortfolioChange} />
            <input name="role" value={portfolioData.role} onChange={handlePortfolioChange} placeholder="Role" />
            <input name="githubUrl" value={portfolioData.githubUrl} onChange={handlePortfolioChange} placeholder="GitHub URL" />
            <input name="liveDemoUrl" value={portfolioData.liveDemoUrl} onChange={handlePortfolioChange} placeholder="Live Demo URL" />
            <FileDrop onDrop={(acceptedFiles) => setPortfolioData(prev => ({ ...prev, imageFiles: acceptedFiles }))} />
          </>
        ) : (
          <>
            <input name="category" value={lifeData.category} onChange={handleLifeChange} placeholder="Category" />
            <input name="name" value={lifeData.name} onChange={handleLifeChange} placeholder="Life Theme" />
            <textarea name="quote" value={lifeData.quote} onChange={handleLifeChange} placeholder="Description" />
            <FileDrop onDrop={(acceptedFiles) => setLifeData(prevData => ({
              ...prevData,
              images: [...prevData.images, ...acceptedFiles]
            }))} />
          </>
        )}
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <PortfolioList></PortfolioList>
    </div>
  );
};

export default AdminPage;
