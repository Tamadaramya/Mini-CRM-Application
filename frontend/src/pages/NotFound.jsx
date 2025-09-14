import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileX } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 rounded-full dark:bg-gray-800">
            <FileX size={48} className="text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="btn btn-primary inline-flex items-center justify-center"
          >
            <Home size={20} className="mr-2" />
            Go to Dashboard
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="btn btn-secondary inline-flex items-center justify-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;