import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  onClick, 
  className = '',
  type = 'button',
  disabled = false 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        (loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;