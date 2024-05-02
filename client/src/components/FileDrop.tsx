import React, { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

interface FileDropProps {
  onDrop: (acceptedFiles: File[]) => void;  // This prop is called when files are accepted
  clearPreviews?: () => void; // Make clearPreviews optional
}

const FileDrop: React.FC<FileDropProps> = ({ onDrop, clearPreviews }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // 为新接收的文件创建预览URLs
      const newFiles = acceptedFiles.map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }));

      // 将新文件的预览URLs添加到现有列表中
      setPreviews(prev => [...prev, ...newFiles.map(file => file.preview)]);

      // 将新文件添加到现有文件列表中，回调到父组件
      onDrop([...acceptedFiles]);  // 确保累加文件
    },
    accept: 'image/*' as unknown as Accept,
    maxSize: 10485760,
    multiple: true  // 允许选择多个文件
  });

  // 清理预览URL
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
