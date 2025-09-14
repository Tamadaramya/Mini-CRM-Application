import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
  fallbackColor = 'bg-primary-600',
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const baseClasses = `inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <img
        className={`${baseClasses} object-cover`}
        src={src}
        alt={alt || name}
      />
    );
  }

  const initials = getInitials(name);

  if (initials) {
    return (
      <div className={`${baseClasses} ${fallbackColor} text-white font-medium`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400`}>
      <User size={iconSizes[size]} />
    </div>
  );
};

export default Avatar;