// src/components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-[88vh] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration - Reduced spacing */}
        <div className="mb-6">
          <div className="text-7xl lg:text-8xl font-bold text-blue-200 mb-2">404</div>
          <div className="text-4xl mb-4">🏥</div>
        </div>

        {/* Error Message - Compact */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-base lg:text-lg text-gray-600 mb-5">
            Oops! The page you're looking for seems to have gone for a check-up. 
            Let's get you back to safety.
          </p>

          {/* Action Button - Single button for cleaner look */}
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Go Back
          </button>
        </div>

        {/* Help Text - Compact */}
        <p className="text-sm text-gray-500">
          Need immediate medical assistance? 
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold ml-1 underline"
          >
            Start consultation
          </button>
        </p>
      </div>
    </div>
  );
}
