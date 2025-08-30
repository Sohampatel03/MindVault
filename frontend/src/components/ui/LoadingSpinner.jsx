import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'indigo' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    purple: 'border-purple-600',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;