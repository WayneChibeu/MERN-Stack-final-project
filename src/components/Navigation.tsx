import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Learner links
  const learnerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/projects', label: 'Projects' },
    { to: '/my-learning', label: 'My Learning', protected: true },
    { to: '/profile', label: 'Profile', protected: true },
  ];

  // Teacher links
  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Teacher Dashboard', roles: ['teacher'] },
    { to: '/teacher/create-course', label: 'Create Course', roles: ['teacher'] },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SDG</span>
                </div>
                <span className="font-bold text-xl text-gray-800 hidden sm:block">Global Goals</span>
                <span className="font-bold text-lg text-gray-800 sm:hidden">Goals</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Learner Links */}
            <div className="flex items-baseline space-x-4">
              {learnerLinks.map((item) => {
                if (item.protected && !user) return null;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.to
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {/* Teacher Links */}
            {user && user.role === 'teacher' && (
              <div className="flex items-baseline space-x-4 border-l border-gray-300 pl-6 ml-6">
                {teacherLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.to
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded capitalize ml-2">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu Content */}
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            {/* User Info Section */}
            {user && (
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-blue-600 capitalize font-semibold">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Learner Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {learnerLinks.map((item) => {
              if (item.protected && !user) return null;
              return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base font-medium w-full text-left transition-colors ${
                      location.pathname === item.to
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                  </Link>
              );
            })}
            </div>
            {/* Teacher Links */}
            {user && user.role === 'teacher' && (
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 mt-2">
                {teacherLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base font-medium w-full text-left transition-colors ${
                      location.pathname === item.to
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {/* Auth Buttons */}
            {user ? (
              <div className="px-2 pb-3">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="px-2 pb-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;