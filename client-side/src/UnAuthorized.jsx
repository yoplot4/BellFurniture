import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Shield Icon Graphic */}
        <div className="flex justify-center">
          <div className="bg-red-50 p-4 rounded-full border-4 border-red-100 shadow-inner">
            <svg 
              className="w-16 h-16 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://w3.org"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text Headers */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Access Denied
          </h1>
          <p className="text-lg font-medium text-red-600">
            You are not an Authorized User
          </p>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')} // Change to your primary destination route
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnAuthorized;
