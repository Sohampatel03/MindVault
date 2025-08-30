import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error,
  label,
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${type === 'password' ? 'pr-10' : 'pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;