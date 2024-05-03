import React, { useState, useEffect, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import FileDrop from '../components/FileDrop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LifeData {
  _id: string;
  category: string;
  images: string[];
  name: string;
  quote: string;
}

const LifeList = () => {
  const [lifeItems, setLifeItems] = useState<LifeData[]>([]);
  const [editingLifeItem, setEditingLifeItem] = useState<LifeData | null>(null);
  const [newLifeItemFiles, setNewLifeItemFiles] = useState<File[]>([]);
  const [isCreatingLifeItem, setIsCreatingLifeItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLifeItems = async () => {
      try {
        const response = await axiosInstance.get<LifeData[]>('/life');
        setLifeItems(response.data);
      } catch (error) {
        setError('Failed to fetch life items');
      }
    };

    fetchLifeItems();
  }, []);

  const handleLifeItemEditChange = (field: keyof LifeData, value: string) => {
    if (editingLifeItem) {
      setEditingLifeItem(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleNewLifeItemFileChange = (files: File[]) => {
    setNewLifeItemFiles(files);
  };

  const handleRemoveLifeImage = (index: number) => {
    if (editingLifeItem && editingLifeItem.images) {
      const updatedImages = editingLifeItem.images.filter((_, idx) => idx !== index);
      setEditingLifeItem(prev => ({ ...prev!, images: updatedImages }));
    }
  };

  const handleSubmitLifeItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  
    let updatedImages = editingLifeItem ? [...editingLifeItem.images] : [];
  
    if (newLifeItemFiles.length > 0) {
      const formData = new FormData();
      newLifeItemFiles.forEach(file => formData.append('files', file, file.name));
  
      const uploadResponse = await axiosInstance.post('/upload/life', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
  
      if (uploadResponse.data.fileUrls) {
        updatedImages = [...updatedImages, ...uploadResponse.data.fileUrls];
      }
    }
  
    const updatedLifeItemData = {...editingLifeItem!, images: updatedImages};
  
    try {
      if (editingLifeItem?._id) {
        await axiosInstance.put(`/life/update/${editingLifeItem._id}`, updatedLifeItemData);
        toast.success('Life item updated successfully!');
      } else {
        await axiosInstance.post('/life/add', updatedLifeItemData);
        toast.success('Life item created successfully!');
      }
  
      setLifeItems(prevItems => prevItems.map(item => item._id === editingLifeItem?._id ? updatedLifeItemData : item));
      setEditingLifeItem(null);
      setNewLifeItemFiles([]);
      setIsCreatingLifeItem(false);
    } catch (error) {
      console.error('Error during file upload or life item update:', error);
      setError('Failed to update life item');
      toast.error('Failed to update life item');
    }
    setLoading(false);
  };

  const handleDeleteLifeItem = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/life/delete/${id}`);
      setLifeItems(lifeItems.filter(item => item._id !== id));
      toast.success('Life item deleted successfully!');
    } catch (error) {
      console.error('Error deleting life item:', error);
      setError('Failed to delete life item');
      toast.error('Failed to delete life item');
    }
    setLoading(false);
  };

  const handleLifeItemCancel = () => {
    setEditingLifeItem(null);
    setNewLifeItemFiles([]);
    setIsCreatingLifeItem(false);
  };

  const startCreatingLifeItem = () => {
    setEditingLifeItem({
      _id:'',
      category: '',
      images: [],
      name: '',
      quote: '',
    });
    setNewLifeItemFiles([]);
    setIsCreatingLifeItem(true);
  };

  return (
    <div>
      <h2>Life Section</h2>
      <form onSubmit={handleSubmitLifeItem}>
        <input
          name="category"
          value={editingLifeItem?.category || ''}
          onChange={e => handleLifeItemEditChange('category', e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="text"
          value={editingLifeItem?.name || ''}
          onChange={e => handleLifeItemEditChange('name', e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={editingLifeItem?.quote || ''}
          onChange={e => handleLifeItemEditChange('quote', e.target.value)}
          placeholder="Quote"
          required
        />
        <FileDrop onDrop={handleNewLifeItemFileChange} />
        {newLifeItemFiles.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
          </div>
        ))}
        {editingLifeItem?.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Life Item Image ${index}`} style={{ width: '100px', height: '100px' }} />
            <button type="button" onClick={() => handleRemoveLifeImage(index)}>Remove</button>
          </div>
        ))}
        <button type="submit">{isCreatingLifeItem ? 'Create' : 'Save'}</button>
        <button type="button" onClick={handleLifeItemCancel}>Cancel</button>
      </form>
      {lifeItems.map((lifeItem) => (
        <div key={lifeItem._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{lifeItem.name}</h3>
          <p>{lifeItem.quote}</p>
          {lifeItem.images.map((image, index) => (
            <img key={index} src={image} alt={`${lifeItem.name} ${index + 1}`} style={{ width: '100px', height: '100px' }} />
          ))}
          <button onClick={() => setEditingLifeItem(lifeItem)}>Edit</button>
          <button onClick={() => handleDeleteLifeItem(lifeItem._id)}>Delete</button>
        </div>
      ))}
      <button onClick={startCreatingLifeItem}>Create New Life Item</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default LifeList;
