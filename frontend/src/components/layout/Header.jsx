import React, { useState } from 'react';
import { Menu, Bell, Settings, LogOut, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const handleLogout = () => {
    logout();
  };

  const notifications = [
    {
      id: 1,
      message: 'New customer added: John Doe',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Lead converted to customer',
      time: '1 hour ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg lg:hidden dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus-ring"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              CRM
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus-ring"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus-ring"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus-ring"
            >
              <Avatar 
                name={user?.name} 
                size="sm" 
                className="ring-2 ring-gray-200 dark:ring-gray-600" 
              />
              <span className="hidden md:block text-sm font-medium">
                {user?.name}
              </span>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="py-2">
                  <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <User size={16} className="mr-3" />
                    Profile
                  </button>
                  <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Settings size={16} className="mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;