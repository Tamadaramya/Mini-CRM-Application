import React from 'react';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {Icon && (
        <div className="mb-4">
          <Icon size={48} className="text-gray-400" />
        </div>
      )}

      {title && (
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      )}

      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;