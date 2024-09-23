import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import {
  fetchUploadedImages,
  updateImage,
  deleteImage,
} from "../service/api/imageApi";
import Swal from "sweetalert2";

interface ImageData {
  _id: string;
  userId: string;
  imageUrl: string;
  title: string;
  order: number;
}

const UploadedImage: React.FC = () => {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetchUploadedImages();
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleEdit = (image: ImageData) => {
    setEditingImage(image);
    setNewTitle(image.title);
  };

  const handleDelete = async (imageId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteImage(imageId);
          fetchImages();
          Swal.fire("Deleted!", "The image has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting image:", error);
          Swal.fire(
            "Error!",
            "Something went wrong. Image could not be deleted.",
            "error"
          );
        }
      }
    });
  };
  const handleUpdate = async () => {
    if (!editingImage) return;
    const isTitleChanged = newTitle.trim() !== editingImage.title;
    const isImageChanged = newImageFile !== null;

    if (!isTitleChanged && !isImageChanged) {
      return;
    }

    try {
      if (newTitle.trim() == "" && !newImageFile) {
        return;
      }
      const formData = new FormData();
      formData.append("title", newTitle);
      if (newImageFile) {
        formData.append("image", newImageFile);
      }
      const response = await updateImage(editingImage._id, formData);
      console.log("response for  update image", response);
      setEditingImage(null);
      setNewImageFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center">No images uploaded</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-8">
      {images.map((image) => (
        <div
          key={image._id}
          className="relative w-full h-64 rounded-lg overflow-hidden shadow-md border "
          onMouseEnter={() => setIsHovered(image._id)}
          onMouseLeave={() => setIsHovered(null)}
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-white text-center">
            {image.title}
          </div>

          {isHovered === image._id && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
              <button
                onClick={() => handleEdit(image)}
                className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
              >
                <Pencil size={24} />
              </button>
              <button
                onClick={() => handleDelete(image._id)}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          )}
        </div>
      ))}

      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Image</h2>
              <button
                onClick={() => setEditingImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              placeholder="New title"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full mb-4"
              accept="image/*"
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedImage;
