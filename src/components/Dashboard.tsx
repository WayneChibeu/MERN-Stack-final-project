import React from 'react';
import { BookOpen, Users, Award, TrendingUp, Play, Clock, Star, Globe } from 'lucide-react';
import { sdg4Data, educationCategories } from '../data/sdg4';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white section-lg">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              EduConnect
            </h1>
            <h2 className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto font-medium text-white">
              Empowering Quality Education for All
            </h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed text-white/80">
              Supporting SDG 4: Ensure inclusive and equitable quality education and promote lifelong learning opportunities for everyone
            </p>
            <div className="btn-group justify-center">
              <button
                onClick={() => setCurrentView('courses')}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Explore Courses
              </button>
              {user?.role === 'teacher' && (
                <button
                  onClick={() => setCurrentView('create-course')}
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Create Course
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding section">
        {/* Stats Section */}
        <div className="grid-responsive-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900" title={stat.title}>{stat.value}</p>
                  <p className="text-small text-green-600 font-medium">{stat.change} this month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`} title={stat.title}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SDG 4 Progress */}
        <div className="card p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">SDG 4: Quality Education Progress</h2>
              <p className="text-gray-600 leading-relaxed">Global progress towards ensuring inclusive and equitable quality education</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{sdg4Data.progress}%</div>
              <div className="text-small text-gray-500">Global Progress</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${sdg4Data.progress}%` }}
            />
          </div>
          <div className="grid-responsive-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900" title="Total number of out-of-school children worldwide">{sdg4Data.globalStats.outOfSchoolChildren.toLocaleString()}</div>
              <div className="text-small text-gray-600">Out-of-school children</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900" title="Percentage of people globally who can read and write">{sdg4Data.globalStats.literacyRate}%</div>
              <div className="text-small text-gray-600">Global literacy rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900" title="Percentage of children who complete primary school">{sdg4Data.globalStats.completionRatePrimary}%</div>
              <div className="text-small text-gray-600">Primary completion</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900" title="Percentage of children who complete secondary school">{sdg4Data.globalStats.completionRateSecondary}%</div>
              <div className="text-small text-gray-600">Secondary completion</div>
            </div>
          </div>
        </div>

        {/* Education Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Education Categories</h2>
          <div className="grid-responsive">
            {educationCategories.map((category) => (
              <div
                key={category.id}
                className="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setCurrentView('courses')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                    <p className="text-small text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-small text-gray-500">
                  <span>{Math.floor(Math.random() * 500) + 100} courses</span>
                  <span className="text-blue-600 hover:underline">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <button
              onClick={() => setCurrentView('courses')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Courses →
            </button>
          </div>
          <div className="grid-responsive">
            {featuredCourses.map((course) => (
              <div key={course.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-small mb-4">by {course.instructor}</p>
                  <div className="flex items-center justify-between text-small text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-6 text-white">Join the Education Revolution</h3>
          <p className="text-lg mb-8 opacity-90 leading-relaxed text-white/80">
            Be part of the global movement to ensure quality education for all. Whether you're a learner seeking knowledge 
            or an educator ready to share your expertise, EduConnect is your platform for impact.
          </p>
          <div className="btn-group justify-center">
            <button
              onClick={() => setCurrentView(user ? 'my-learning' : 'register')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user ? 'My Learning' : 'Start Learning'}
            </button>
            {(!user || user.role === 'teacher') && (
              <button
                onClick={() => setCurrentView(user ? 'create-course' : 'register')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {user ? 'Create Course' : 'Become an Educator'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;