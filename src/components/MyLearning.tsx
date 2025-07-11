import React, { useState } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MyLearningProps {
  setCurrentView: (view: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

const MyLearning: React.FC<MyLearningProps> = ({ setCurrentView, setSelectedCourse }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('enrolled');

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: '1',
      title: 'Digital Literacy Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      timeSpent: 28,
      totalTime: 40,
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Digital Literacy',
      lastAccessed: '2024-01-20',
      nextLesson: 'Internet Safety and Security'
    },
    {
      id: '2',
      title: 'Mathematics for Primary Education',
      instructor: 'Prof. Michael Chen',
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      timeSpent: 22,
      totalTime: 60,
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Primary Education',
      lastAccessed: '2024-01-18',
      nextLesson: 'Fractions and Decimals'
    },
    {
      id: '3',
      title: 'Environmental Science & Sustainability',
      instructor: 'Dr. Amara Okafor',
      progress: 90,
      totalLessons: 10,
      completedLessons: 9,
      timeSpent: 32,
      totalTime: 35,
      image: 'https://images.pexels.com/photos/8926558/pexels-photo-8926558.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Environmental Studies',
      lastAccessed: '2024-01-19',
      nextLesson: 'Final Assessment'
    }
  ];

  // Mock completed courses data
  const completedCourses = [
    {
      id: '4',
      title: 'Adult Literacy Program',
      instructor: 'Maria Rodriguez',
      completedDate: '2024-01-10',
      grade: 95,
      timeSpent: 45,
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Adult Learning',
      certificateId: 'CERT-2024-001'
    },
    {
      id: '5',
      title: 'Financial Literacy for Everyone',
      instructor: 'Dr. Lisa Park',
      completedDate: '2023-12-15',
      grade: 88,
      timeSpent: 25,
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Life Skills',
      certificateId: 'CERT-2023-045'
    }
  ];

  // Mock certificates data
  const certificates = [
    {
      id: 'CERT-2024-001',
      courseTitle: 'Adult Literacy Program',
      issuedDate: '2024-01-10',
      instructor: 'Maria Rodriguez',
      grade: 95
    },
    {
      id: 'CERT-2023-045',
      courseTitle: 'Financial Literacy for Everyone',
      issuedDate: '2023-12-15',
      instructor: 'Dr. Lisa Park',
      grade: 88
    }
  ];

  // Learning statistics
  const stats = {
    totalCourses: enrolledCourses.length + completedCourses.length,
    completedCourses: completedCourses.length,
    totalHours: enrolledCourses.reduce((sum, course) => sum + course.timeSpent, 0) + 
                completedCourses.reduce((sum, course) => sum + course.timeSpent, 0),
    certificates: certificates.length,
    averageProgress: Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentView('course-detail');
  };

  const downloadCertificate = (certificateId: string) => {
    // Mock certificate download
    console.log('Downloading certificate:', certificateId);
    // In real app, this would generate and download a PDF certificate
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your educational journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-orange-600">{stats.certificates}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Average Progress: {stats.averageProgress}%</span>
            </div>
          </div>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>{course.timeSpent}/{course.totalTime} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{course.progress}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'enrolled', label: 'Enrolled Courses', count: enrolledCourses.length },
                { id: 'completed', label: 'Completed', count: completedCourses.length },
                { id: 'certificates', label: 'Certificates', count: certificates.length }
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
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Enrolled Courses Tab */}
            {activeTab === 'enrolled' && (
              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-gray-600">by {course.instructor}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {course.category}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Progress:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-blue-600"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="font-medium text-gray-900">{course.progress}%</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Lessons:</span>
                            <p className="font-medium text-gray-900">
                              {course.completedLessons}/{course.totalLessons} completed
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Time spent:</span>
                            <p className="font-medium text-gray-900">
                              {course.timeSpent}/{course.totalTime} hours
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>Next: {course.nextLesson}</span>
                            <span className="mx-2">•</span>
                            <span>Last accessed: {course.lastAccessed}</span>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleCourseClick(course.id)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              View Course
                            </button>
                            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              <Play className="w-4 h-4" />
                              <span>Continue</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Courses Tab */}
            {activeTab === 'completed' && (
              <div className="space-y-6">
                {completedCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-gray-600">by {course.instructor}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">Completed</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Completed:</span>
                            <p className="font-medium text-gray-900">{course.completedDate}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Final Grade:</span>
                            <p className="font-medium text-gray-900">{course.grade}%</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Time spent:</span>
                            <p className="font-medium text-gray-900">{course.timeSpent} hours</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {course.category}
                          </span>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => downloadCertificate(course.certificateId)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Award className="w-4 h-4" />
                              <span>Download Certificate</span>
                            </button>
                            <button
                              onClick={() => handleCourseClick(course.id)}
                              className="text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Review Course
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-500">#{cert.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.courseTitle}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Instructor:</span> {cert.instructor}</p>
                      <p><span className="font-medium">Issued:</span> {cert.issuedDate}</p>
                      <p><span className="font-medium">Grade:</span> {cert.grade}%</p>
                    </div>
                    <button
                      onClick={() => downloadCertificate(cert.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Download Certificate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;