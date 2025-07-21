import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Play, Clock, Star, Globe } from 'lucide-react';
import { sdg4Data, educationCategories } from '../data/sdg4';
import { useAuth } from '../context/AuthContext';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map((p) => p[0]).join('').toUpperCase();
};

const motivationalQuotes = [
  "Learning never exhausts the mind. – Leonardo da Vinci",
  "The beautiful thing about learning is nobody can take it away from you. – B.B. King",
  "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "The future belongs to those who learn more skills and combine them in creative ways. – Robert Greene",
  "The expert in anything was once a beginner. – Helen Hayes",
  "Don’t let what you cannot do interfere with what you can do. – John Wooden",
  "Strive for progress, not perfection.",
  "Your education is a dress rehearsal for a life that is yours to lead. – Nora Ephron",
  "Push yourself, because no one else is going to do it for you."
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Courses',
      value: '2,847',
      change: '+12%',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Learners',
      value: '45,231',
      change: '+8%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Certificates Issued',
      value: '12,456',
      change: '+15%',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Global Reach',
      value: '127 Countries',
      change: '+3',
      icon: Globe,
      color: 'bg-orange-500'
    }
  ];

  const featuredCourses = [
    {
      id: '1',
      title: 'Digital Literacy for Beginners',
      instructor: 'Dr. Sarah Johnson',
      students: 1234,
      rating: 4.8,
      duration: '6 weeks',
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Digital Literacy'
    },
    {
      id: '2',
      title: 'Mathematics for Primary Education',
      instructor: 'Prof. Michael Chen',
      students: 892,
      rating: 4.9,
      duration: '8 weeks',
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Primary Education'
    },
    {
      id: '3',
      title: 'Sustainable Development Education',
      instructor: 'Dr. Amara Okafor',
      students: 567,
      rating: 4.7,
      duration: '4 weeks',
      image: 'https://images.pexels.com/photos/8926558/pexels-photo-8926558.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Environmental Studies'
    }
  ];

  const quote = getRandomQuote();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="relative z-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl shadow-lg px-10 py-8 flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-white text-opacity-80 text-lg">Here’s your learning dashboard</p>
          <blockquote className="mt-4 text-base italic text-cyan-100 border-l-4 border-cyan-200 pl-4">
            {quote}
          </blockquote>
        </div>
        <div className="flex items-center gap-4 mt-6 sm:mt-0">
          <span className="px-4 py-1 rounded-full bg-white text-teal-700 font-semibold shadow text-sm" aria-label="Student role">Student</span>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Your profile"
              className="w-14 h-14 rounded-full border-2 border-white shadow object-cover"
              aria-label="Your profile"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-teal-200 flex items-center justify-center text-2xl font-bold text-teal-700" aria-label="Your profile initials">
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      </header>
      {/* Restore the rest of the dashboard as it was before the redesign */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.title} className={`rounded-xl shadow-md p-6 flex flex-col items-start bg-white hover:shadow-lg transition-shadow duration-200 border-t-4 ${stat.color}`}>
              <div className="flex items-center mb-4">
                <stat.icon className="h-7 w-7 text-white bg-opacity-80 rounded-full p-1 mr-3" />
                <span className="text-lg font-semibold text-gray-800">{stat.title}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-green-600 font-medium">{stat.change}</div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="flex flex-wrap gap-4 mb-10 justify-center">
          <Link to="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition">Browse Courses</Link>
          <Link to="/my-learning" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition">My Learning</Link>
          <Link to="/projects" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition">Projects</Link>
          <Link to="/profile" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow transition">Profile</Link>
        </section>

        {/* Featured Courses */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
                <img src={course.image} alt={course.title} className="h-40 w-full object-cover" />
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">By {course.instructor}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    <span className="text-xs text-gray-400">({course.students} students)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">{course.category}</span>
                  </div>
                  <Link to={`/courses/${course.id}`} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-center">View Course</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;