import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 animate-slide-up ${styles[type]}`}>
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;