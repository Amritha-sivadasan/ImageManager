import React, { useState, useCallback } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { uploadImage } from "../service/api/imageApi";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ImageFile {
  file: File;
  id: string;
  preview: string;
  title: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
        title: file.name,
      })),
    ]);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, title: newTitle } : img))
    );
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image.file);
      formData.append("titles", image.title);
    });

    try {
      const response = await uploadImage(formData);
      console.log("Upload successful", response);
      navigate("/uploaded-image");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Image Upload Dashboard
      </h1>

      <div
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          onDrop(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
        className="border-dashed border-2 border-blue-300 rounded-lg p-4 mb-4 text-center cursor-pointer transition-all hover:bg-blue-50 w-64 mx-auto"
      >
        <Upload className="mx-auto text-blue-500 mb-2" size={36} />
        <p className="text-gray-600 mb-1 text-sm">
          Drag & drop images here or click to select
        </p>
        <input
          type="file"
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              onDrop(Array.from(e.target.files));
            }
          }}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer text-sm"
        >
          Select Files
        </label>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4 mt-10"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative group"
                    >
                      <div className="w-40 h-48 bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                          src={image.preview}
                          alt={image.title}
                          className="w-full h-32 object-cover"
                        />
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTitleChange(image.id, e.target.value)
                          }
                          className="w-full p-2 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {images.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Upload Images
        </button>
      )}
    </div>
  );
};

export default Dashboard;
