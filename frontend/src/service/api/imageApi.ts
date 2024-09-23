import { axiosInstance } from "../instance/axiosInstance";

interface Error {
  response?: {
    data?: {
      message: string;
    };
  };
}

export const uploadImage = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/uploadImage", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const fetchUploadedImages = async () => {
  try {
    const response = await axiosInstance.get("/all-images");
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const updateImage = async (imageId: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(`/updateImage/${imageId}`, data);
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    const response = await axiosInstance.delete(`/deleteImage/${imageId}`);
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};
