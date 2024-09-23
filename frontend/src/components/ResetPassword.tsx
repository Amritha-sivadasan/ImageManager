import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resetPassword, validateResetToken } from '../service/api/useApi';


// import { validateResetToken, resetPassword } from '../service/api/useApi';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
 

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
       
        try {
          const response = await validateResetToken(token);
       
          if (!response.success) {
            toast.error('Invalid or expired reset link. Please request a new one.');
            navigate('/forgotPassword');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          toast.error('An error occurred. Please try again.');
          navigate('/forgotPassword');
        }
      }
    };

    checkToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(token!, password);
      
      if (response.success) {
        toast.success('Password reset successfully');
        navigate('/login');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.log('error',error);
      
    } finally {
      setIsLoading(false);
    }
  };

//   if (!isTokenValid) {
//     return null; // Or a loading spinner
//   }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <Lock className="text-white" size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;