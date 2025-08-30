import React, { useState } from 'react';
import { Brain, Bell, Settings, User, LogOut, Search } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">MindVault</h1>
              <p className="text-xs text-gray-500">AI Study Companion</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search folders, concepts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block font-medium">{user.name}</span>
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg py-2 z-50 min-w-48">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;