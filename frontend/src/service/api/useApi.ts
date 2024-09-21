import axios from "axios";
import { LoginFormData } from "../../components/LoginPage";
const API_URl = import.meta.env.VITE_BASE_URL;

interface Error {
  response?: {
    data?: {
      message: string;
    };
  };
}

export const register = async (
  email: string,
  password: string,
  phoneNumber: string
) => {
  try {
    const response = await axios.post(`${API_URl}/register`, {
      email,
      password,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.log("error in register", error);
    return (error as Error).response?.data;
  }
};

export const sendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URl}/sendOtp`, { email });

    return response.data;
  } catch (error) {
    console.log("error in register", error);
    return (error as Error).response?.data;
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await axios.post(`${API_URl}/verifyOtp`, { otp, email });

    console.log("response for verify otp", response);
    return response.data;
  } catch (error) {
  
    return (error as Error).response?.data;
  }
};


export const loginUser  = async(data:LoginFormData)=>{
  try {
    const response = await axios.post(`${API_URl}/login`,data);
    return response.data;
    
  } catch (error) {
    return (error as Error).response?.data;
  }
}
