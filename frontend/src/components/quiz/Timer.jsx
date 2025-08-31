import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Pause, Play } from 'lucide-react';

const Timer = ({ timeElapsed, isActive, onToggle, showControls = true }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeElapsed < 300) return 'text-green-600'; // Under 5 minutes
    if (timeElapsed < 600) return 'text-yellow-600'; // Under 10 minutes
    return 'text-red-600'; // Over 10 minutes
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Timer Icon */}
      <motion.div
        animate={{ 
          rotate: isActive ? 360 : 0,
          scale: isActive ? 1.1 : 1 
        }}
        transition={{ 
          rotate: { duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" },
          scale: { duration: 0.3 }
        }}
        className="p-2 bg-indigo-50 rounded-lg"
      >
        <Clock className="w-5 h-5 text-indigo-600" />
      </motion.div>

      {/* Time Display */}
      <div className="flex flex-col">
        <motion.span
          key={timeElapsed}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`text-2xl font-mono font-bold ${getTimeColor()}`}
        >
          {formatTime(timeElapsed)}
        </motion.span>
        <span className="text-xs text-gray-500">
          {isActive ? 'Running' : 'Paused'}
        </span>
      </div>

      {/* Controls */}
      {showControls && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {isActive ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </motion.button>
      )}

      {/* Progress Ring (Optional Visual Enhancement) */}
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ 
              strokeDashoffset: 100 - (timeElapsed % 60) * (100 / 60)
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default Timer;