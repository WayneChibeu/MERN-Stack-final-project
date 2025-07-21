import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Education for Sustainable Development</h3>
            <p className="text-gray-300">
              Empowering learners through quality education and sustainable development initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/course-catalog" className="text-gray-300 hover:text-white transition">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/my-learning" className="text-gray-300 hover:text-white transition">
                  My Learning
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* SDG Focus */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SDG Focus</h3>
            <p className="text-gray-300">
              Aligned with UN SDG 4: Quality Education
            </p>
            <p className="text-gray-300 mt-2">
              Contributing to sustainable development through accessible and quality education for all.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>© {new Date().getFullYear()} Education Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 