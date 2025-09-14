import React from 'react';

const Loading = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loading component
export const PageLoading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
};

// Inline loading component
export const InlineLoading = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Loading size="md" text={text} />
    </div>
  );
};

export default Loading;