import React, { useState } from 'react';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, MessageCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TeacherDashboardProps {
  setCurrentView: (view: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setCurrentView, setSelectedCourse }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
        setSelectedCourse(courseId);
        setCurrentView('course-detail');
        break;
      case 'edit':
        // Navigate to edit course
        console.log('Edit course:', courseId);
        break;
      case 'delete':
        // Delete course
        console.log('Delete course:', courseId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Manage your courses and track your impact.</p>
          </div>
          <button
            onClick={() => setCurrentView('create-course')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{teacherStats.totalCourses}</p>
                <p className="text-sm text-green-600">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{teacherStats.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{teacherStats.newEnrollments} this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${teacherStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+${teacherStats.monthlyEarnings} this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{teacherStats.averageRating}</p>
                <p className="text-sm text-green-600">Excellent performance</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'courses', label: 'My Courses', count: myCourses.length },
                { id: 'analytics', label: 'Analytics' },
                { id: 'discussions', label: 'Discussions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setCurrentView('create-course')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                      <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">Create New Course</p>
                      <p className="text-sm text-gray-500">Start building your next course</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">View Discussions</p>
                      <p className="text-sm text-gray-500">Engage with your students</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">View Analytics</p>
                      <p className="text-sm text-gray-500">Track your performance</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">23 new enrollments</span> in "Digital Literacy Fundamentals"
                      </p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">New 5-star review</span> on "Advanced Web Development"
                      </p>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">$340 earned</span> from course sales today
                      </p>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>

                {/* Top Performing Courses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
                  <div className="space-y-3">
                    {analyticsData.topCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${course.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Courses ({myCourses.length})</h3>
                  <button
                    onClick={() => setCurrentView('create-course')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.category}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">Students:</span>
                              <p className="font-medium text-gray-900">{course.students.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Revenue:</span>
                              <p className="font-medium text-gray-900">
                                {course.revenue === 0 ? 'Free' : `$${course.revenue.toLocaleString()}`}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Rating:</span>
                              <p className="font-medium text-gray-900">{course.rating} ⭐</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium text-gray-900">
                                {course.price === 0 ? 'Free' : `$${course.price}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Updated: {course.lastUpdated}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleCourseAction('view', course.id)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Course"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCourseAction('edit', course.id)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Course"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCourseAction('delete', course.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Course Analytics</h3>
                
                {/* Enrollment Trend */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Monthly Enrollments</h4>
                  <div className="flex items-end space-x-4 h-40">
                    {analyticsData.enrollmentTrend.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-blue-600 rounded-t w-8"
                          style={{ height: `${(data.enrollments / 200) * 100}%` }}
                        />
                        <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                        <span className="text-xs font-medium text-gray-900">{data.enrollments}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Performance */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Course Performance</h4>
                  <div className="space-y-4">
                    {myCourses.filter(course => course.status === 'published').map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{course.title}</h5>
                            <p className="text-sm text-gray-500">{course.students} students</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{course.enrollments}</p>
                            <p className="text-gray-500">New enrollments</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{course.completions}</p>
                            <p className="text-gray-500">Completions</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{course.rating}</p>
                            <p className="text-gray-500">Rating</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Discussions Tab */}
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Course Discussions</h3>
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h4>
                  <p className="text-gray-600 mb-6">
                    Students haven't started any discussions in your courses yet. 
                    Encourage engagement by asking questions in your course content.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Start a Discussion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;