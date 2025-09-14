import React from 'react';

const StatusBadge = ({ status, variant = 'default', size = 'sm', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',

    // Lead status specific variants
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    converted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  // Auto-detect lead status variant
  const getVariantFromStatus = (status) => {
    if (!status) return 'default';

    const statusLower = status.toLowerCase();
    if (['new'].includes(statusLower)) return 'new';
    if (['contacted'].includes(statusLower)) return 'contacted';
    if (['converted'].includes(statusLower)) return 'converted';
    if (['lost'].includes(statusLower)) return 'lost';

    return variant;
  };

  const finalVariant = variant === 'default' ? getVariantFromStatus(status) : variant;
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[finalVariant]} ${className}`;

  return (
    <span className={classes}>
      {status}
    </span>
  );
};

export default StatusBadge;