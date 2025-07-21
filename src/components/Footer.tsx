import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">EduConnect</h3>
            <p className="text-sm text-gray-500">
              Connecting learners and educators through quality education and sustainable development.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-6 mt-4">
              <a 
                href="https://www.linkedin.com/in/wayne-chibeu-482451278/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-200 group"
                aria-label="Visit Wayne Chibeu's LinkedIn Profile"
              >
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
              </a>
              <a 
                href="https://github.com/waynechibeu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-900 transition-colors duration-200 group"
                aria-label="Visit Wayne's GitHub Profile"
              >
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  to={user?.role === 'teacher' ? '/teacher/dashboard' : '/dashboard/student'} 
                  className="text-sm text-gray-500 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/my-learning" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  My Learning
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  Profile
                </Link>
              </li>
              {user?.role === 'teacher' && (
                <li>
                  <Link to="/teacher/create-course" className="text-sm text-gray-500 hover:text-blue-600 transition">
                    Create Course
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* SDG Focus */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wide">Our Mission</h3>
            <p className="text-sm text-gray-500">
              Aligned with UN SDG 4: Quality Education
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Empowering sustainable development through accessible education.
            </p>
            <div className="mt-4">
              <a 
                href="https://sdgs.un.org/goals/goal4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                Learn more about SDG 4
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} EduConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 