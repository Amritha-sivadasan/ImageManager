import React, { useContext } from "react";
import { Upload, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { userContext } from "../context/context";

const HomePage: React.FC = () => {
  const { user } = useContext(userContext);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Upload and Share Your</span>
            <span className="block text-blue-600">Images with Ease</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Fast, secure, and simple image uploading for everyone. Share your
            memories, artwork, or documents in seconds.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                  
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              )}
             
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Why Choose ImageUploader?
          </h2>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Zap className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Lightning Fast
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Upload your images in seconds with our optimized servers and
                CDN.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Secure Storage
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Your images are encrypted and stored securely in our cloud
                infrastructure.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Easy Sharing
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Share your uploaded images with a simple link or embed them
                anywhere.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
