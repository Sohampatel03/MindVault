import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <div className={`p-2 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            
            {trend && (
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;