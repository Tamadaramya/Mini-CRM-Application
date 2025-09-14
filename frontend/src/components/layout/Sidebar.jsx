import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3, 
  X,
  Building2,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Overview and analytics',
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      description: 'Manage customer relationships',
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: TrendingUp,
      description: 'Track sales opportunities',
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      description: 'Analytics and insights',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 dark:bg-gray-800 dark:border-gray-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                CRM
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                v1.0.0
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 focus-ring"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={onClose}
            >
              <item.icon
                size={20}
                className={`mr-3 flex-shrink-0`}
              />
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="text-xs opacity-75">
                  {item.description}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Customer Relationship Management
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;