import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, Play, CheckCircle, TrendingUp } from 'lucide-react';
import { apiFetch } from '../utils/apiFetch';

interface MyLearningProps {
  setCurrentView: (view: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

interface EnrolledCourse {
  _id: string;
  user_id: string;
  course_id: {
    _id: string;
    title: string;
    instructor_id: { name: string };
    image_url: string;
    category: string;
    lessons: number;
    duration: number;
  };
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  time_spent: number;
  status: string;
  enrollment_date: string;
  grade?: number;
  completion_date?: string;
}

const MyLearning: React.FC<MyLearningProps> = ({ setCurrentView, setSelectedCourse }) => {
  const [activeTab, setActiveTab] = useState('enrolled');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [completedCourses, setCompletedCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const enrollments: EnrolledCourse[] = await apiFetch('/user/enrolled-courses');
        
        // Separate enrolled and completed
        const enrolled = enrollments.filter(e => e.status === 'enrolled' || e.status === 'in-progress');
        const completed = enrollments.filter(e => e.status === 'completed');
        
        setEnrolledCourses(enrolled);
        setCompletedCourses(completed);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        setEnrolledCourses([]);
        setCompletedCourses([]);
      }
    };

    fetchEnrollments();
  }, []);

  // Learning statistics
  const stats = {
    totalCourses: enrolledCourses.length + completedCourses.length,
    completedCourses: completedCourses.length,
    totalHours: enrolledCourses.reduce((sum, course) => sum + (course.time_spent || 0), 0) / 60 + 
                completedCourses.reduce((sum, course) => sum + (course.time_spent || 0), 0) / 60,
    certificates: completedCourses.length,
    averageProgress: enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) : 0
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentView('course-detail');
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
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.totalHours)}</p>
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
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment._id} className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={enrollment.course_id?.image_url || 'https://via.placeholder.com/64'}
                    alt={enrollment.course_id?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{enrollment.course_id?.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{enrollment.completed_lessons}/{enrollment.total_lessons} lessons</span>
                    <span>{Math.round(enrollment.time_spent / 60)} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{enrollment.progress}%</div>
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
                { id: 'certificates', label: 'Certificates', count: completedCourses.length }
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
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={enrollment.course_id?.image_url || 'https://via.placeholder.com/80'}
                            alt={enrollment.course_id?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{enrollment.course_id?.title}</h3>
                              <p className="text-gray-600">by {enrollment.course_id?.instructor_id?.name}</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {enrollment.course_id?.category}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-500">Progress:</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full bg-blue-600"
                                    style={{ width: `${enrollment.progress}%` }}
                                  />
                                </div>
                                <span className="font-medium text-gray-900">{enrollment.progress}%</span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Lessons:</span>
                              <p className="font-medium text-gray-900">
                                {enrollment.completed_lessons}/{enrollment.total_lessons} completed
                              </p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Time spent:</span>
                              <p className="font-medium text-gray-900">
                                {Math.round(enrollment.time_spent / 60)} hours
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span className="mx-2">•</span>
                            <span>Last accessed: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleCourseClick(enrollment.course_id?._id)}
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No enrolled courses</h3>
                    <p className="text-gray-500">Start learning by exploring our course catalog</p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Courses Tab */}
            {activeTab === 'completed' && (
              <div className="space-y-6">
                {completedCourses.length > 0 ? (
                  completedCourses.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={enrollment.course_id?.image_url || 'https://via.placeholder.com/80'}
                            alt={enrollment.course_id?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{enrollment.course_id?.title}</h3>
                              <p className="text-gray-600">by {enrollment.course_id?.instructor_id?.name}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-green-600 font-medium">Completed</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-500">Completed:</span>
                              <p className="font-medium text-gray-900">{new Date(enrollment.completion_date || '').toLocaleDateString()}</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Final Grade:</span>
                              <p className="font-medium text-gray-900">{enrollment.grade}%</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Time spent:</span>
                            <p className="font-medium text-gray-900">{Math.round(enrollment.time_spent / 60)} hours</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {enrollment.course_id?.category}
                          </span>
                          <div className="flex space-x-3">
                            <button
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Award className="w-4 h-4" />
                              <span>View Certificate</span>
                            </button>
                            <button
                              onClick={() => handleCourseClick(enrollment.course_id?._id)}
                              className="text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Review Course
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No completed courses yet</h3>
                    <p className="text-gray-500">Complete a course to earn your certificate</p>
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.length > 0 ? (
                  completedCourses.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">#{enrollment._id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{enrollment.course_id?.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><span className="font-medium">Instructor:</span> {enrollment.course_id?.instructor_id?.name}</p>
                        <p><span className="font-medium">Issued:</span> {new Date(enrollment.completion_date || '').toLocaleDateString()}</p>
                        <p><span className="font-medium">Grade:</span> {enrollment.grade}%</p>
                      </div>
                      <button
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Certificate
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No certificates earned yet</h3>
                    <p className="text-gray-500">Complete courses to earn certificates</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;