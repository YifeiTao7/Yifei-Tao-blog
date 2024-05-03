import React, { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

interface FileDropProps {
  onDrop: (acceptedFiles: File[]) => void;
  clearPreviews?: () => void;
}

const FileDrop: React.FC<FileDropProps> = ({ onDrop, clearPreviews }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }));
      setPreviews(prev => [...prev, ...newFiles.map(file => file.preview)]);
      onDrop([...acceptedFiles]);
    },
    accept: 'image/*,video/*' as unknown as Accept,
    maxSize: 10485760,
    multiple: true 
  });

  const clearPreviewImages = () => {
    setPreviews([]);
    if (clearPreviews) {
      clearPreviews();
    }
  };

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      {isDragActive ? 
        <p>Drop the files here...</p> : 
        <p>Drag 'n' drop some files here, or click to select files</p>
      }
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: 100, height: 100, marginRight: 10 }} />
        ))}
      </div>
    </div>
  );
};

export default FileDrop;
