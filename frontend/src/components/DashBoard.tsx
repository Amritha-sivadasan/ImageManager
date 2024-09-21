import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, BarChart2 } from 'lucide-react';

interface ImageFile extends File {
  preview: string;
}

const Dashboard: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prevImages => [
      ...prevImages,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, []);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onDrop(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Image Upload Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stats */}
          <div className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <ImageIcon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <Upload className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uploaded Today</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <div className="bg-purple-500 p-3 rounded-full mr-4">
                <BarChart2 className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">0 MB</p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Drag and drop your images here, or click to select files</p>
              </label>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.slice(-6).map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={file.preview} 
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No images uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;