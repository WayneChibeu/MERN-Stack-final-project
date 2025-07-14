import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, MessageCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map((p) => p[0]).join('').toUpperCase();
};

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setCurrentView, setSelectedCourse }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock teacher data
  const teacherStats = {
    totalCourses: 8,
    totalStudents: 2847,
    totalRevenue: 15420,
    averageRating: 4.8,
    monthlyEarnings: 2340,
    newEnrollments: 156
  };

  // Mock courses data
  const myCourses = [
    {
      id: '1',
      title: 'Digital Literacy Fundamentals',
      students: 1234,
      revenue: 0,
      rating: 4.8,
      status: 'published',
      created: '2024-01-15',
      lastUpdated: '2024-01-20',
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Digital Literacy',
      price: 0,
      enrollments: 45,
      completions: 892
    },
    {
      id: '2',
      title: 'Advanced Web Development',
      students: 567,
      revenue: 8950,
      rating: 4.9,
      status: 'published',
      created: '2024-01-10',
      lastUpdated: '2024-01-18',
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Vocational Training',
      price: 199,
      enrollments: 23,
      completions: 445
    },
    {
      id: '3',
      title: 'Mathematics for Teachers',
      students: 892,
      revenue: 4460,
      rating: 4.7,
      status: 'published',
      created: '2024-01-05',
      lastUpdated: '2024-01-16',
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Primary Education',
      price: 79,
      enrollments: 67,
      completions: 234
    },
    {
      id: '4',
      title: 'Environmental Education Basics',
      students: 154,
      revenue: 0,
      rating: 4.6,
      status: 'draft',
      created: '2024-01-22',
      lastUpdated: '2024-01-22',
      image: 'https://images.pexels.com/photos/8926558/pexels-photo-8926558.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Environmental Studies',
      price: 0,
      enrollments: 0,
      completions: 0
    }
  ];

  // Mock analytics data
  const analyticsData = {
    enrollmentTrend: [
      { month: 'Jan', enrollments: 45 },
      { month: 'Feb', enrollments: 67 },
      { month: 'Mar', enrollments: 89 },
      { month: 'Apr', enrollments: 123 },
      { month: 'May', enrollments: 156 }
    ],
    topCourses: myCourses.slice(0, 3).map(course => ({
      title: course.title,
      students: course.students,
      revenue: course.revenue
    }))
  };

  const handleCourseAction = (action: string, courseId: string) => {
    switch (action) {
      case 'view':
        navigate(`/course/${courseId}`);
        break;
      case 'edit':
        // Navigate to edit course (implement as needed)
        break;
      case 'delete':
        // Delete course (implement as needed)
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 relative">
      {/* Subtle background pattern */}
      <svg
        className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none z-0"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="#6366F1" />
      </svg>
      {/* Header with Teacher badge and avatar */}
      <header className="relative z-10 bg-indigo-600 text-white px-8 py-6 rounded-b-2xl shadow flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="px-4 py-1 rounded-full bg-white text-indigo-700 font-semibold shadow text-sm ml-4" aria-label="Teacher role">Teacher</span>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Your profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
              aria-label="Your profile"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700" aria-label="Your profile initials">
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      </header>
      <main className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Example stats/analytics cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow border-t-4 border-indigo-500 p-6 flex flex-col items-start focus-within:ring-2 focus-within:ring-indigo-400" tabIndex={0} aria-label="Total Courses">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
              <span className="text-lg font-semibold">Total Courses</span>
            </div>
            <span className="text-3xl font-bold text-indigo-700">8</span>
          </div>
          <div className="bg-white rounded-xl shadow border-t-4 border-indigo-500 p-6 flex flex-col items-start focus-within:ring-2 focus-within:ring-indigo-400" tabIndex={0} aria-label="Active Students">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span className="text-lg font-semibold">Active Students</span>
            </div>
            <span className="text-3xl font-bold text-indigo-700">120</span>
          </div>
          <div className="bg-white rounded-xl shadow border-t-4 border-indigo-500 p-6 flex flex-col items-start focus-within:ring-2 focus-within:ring-indigo-400" tabIndex={0} aria-label="Assignments Graded">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M3 7v4a1 1 0 001 1h3m10-5h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h2" /></svg>
              <span className="text-lg font-semibold">Assignments Graded</span>
            </div>
            <span className="text-3xl font-bold text-indigo-700">56</span>
          </div>
        </section>
        {/* Your Courses section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example course card */}
            <div className="bg-white rounded-xl shadow border-l-4 border-indigo-500 p-5 flex flex-col focus-within:ring-2 focus-within:ring-indigo-400" tabIndex={0} aria-label="Course: Modern Web Development">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
                <span className="font-semibold">Modern Web Development</span>
              </div>
              <span className="text-sm text-gray-500 mb-2">Enrolled: 40 students</span>
              <button className="mt-auto self-end px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" aria-label="View course details">
                View Details
              </button>
            </div>
            {/* Add more course cards as needed */}
          </div>
        </section>
        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-5 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" aria-label="Create new course">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Create Course
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg shadow hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" aria-label="View analytics">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17a2.5 2.5 0 002.5-2.5V7m-5 10a2.5 2.5 0 002.5-2.5V7m-5 10a2.5 2.5 0 002.5-2.5V7" /></svg>
              View Analytics
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;