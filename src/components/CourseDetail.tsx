import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, Award, MessageCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface CourseDetailProps {
  courseId: string | null;
  setCurrentView: (view: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, setCurrentView }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolled, setEnrolled] = useState(false);

  // Mock course data - in real app, fetch by courseId
  const course = {
    id: courseId || '1',
    title: 'Digital Literacy Fundamentals',
    description: 'Master essential digital skills for the modern world. This comprehensive course covers computer basics, internet safety, digital communication, and productivity tools that are essential for personal and professional success in today\'s digital age.',
    instructor: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'Digital Education Specialist with 15+ years of experience in technology training and curriculum development.',
      rating: 4.9,
      students: 12450,
      courses: 8
    },
    category: 'Digital Literacy',
    subject: 'Technology',
    level: 'beginner',
    duration: 40,
    price: 0,
    rating: 4.8,
    students: 1234,
    reviews: 456,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800',
    certificate: true,
    lastUpdated: '2024-01-15',
    language: 'English',
    lessons: [
      {
        id: '1',
        title: 'Introduction to Digital Literacy',
        description: 'Understanding what digital literacy means in today\'s world',
        duration: 15,
        is_free: true,
        completed: false
      },
      {
        id: '2',
        title: 'Computer Basics and Navigation',
        description: 'Learn fundamental computer operations and file management',
        duration: 25,
        is_free: false,
        completed: false
      },
      {
        id: '3',
        title: 'Internet Safety and Security',
        description: 'Protecting yourself online and understanding digital privacy',
        duration: 20,
        is_free: false,
        completed: false
      },
      {
        id: '4',
        title: 'Digital Communication Tools',
        description: 'Email, messaging, and video conferencing best practices',
        duration: 30,
        is_free: false,
        completed: false
      },
      {
        id: '5',
        title: 'Productivity Software Essentials',
        description: 'Word processing, spreadsheets, and presentation tools',
        duration: 35,
        is_free: false,
        completed: false
      }
    ],
    skills: [
      'Computer Navigation',
      'Internet Safety',
      'Email Communication',
      'File Management',
      'Digital Privacy',
      'Online Research',
      'Productivity Tools',
      'Digital Citizenship'
    ],
    requirements: [
      'Basic reading and writing skills',
      'Access to a computer or tablet',
      'Stable internet connection',
      'Willingness to learn and practice'
    ],
    whatYouLearn: [
      'Navigate computers and mobile devices confidently',
      'Use the internet safely and effectively',
      'Communicate professionally through digital channels',
      'Manage files and organize digital content',
      'Protect personal information online',
      'Use productivity software for work and personal tasks',
      'Understand digital citizenship and ethics',
      'Troubleshoot common technical issues'
    ]
  };

  const reviews = [
    {
      id: '1',
      user: 'Maria Rodriguez',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      date: '2024-01-10',
      comment: 'Excellent course! Dr. Johnson explains everything clearly and the practical exercises really helped me gain confidence with technology.'
    },
    {
      id: '2',
      user: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      date: '2024-01-08',
      comment: 'Perfect for beginners. I went from being afraid of computers to feeling comfortable using them for work and personal tasks.'
    },
    {
      id: '3',
      user: 'Lisa Chen',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4,
      date: '2024-01-05',
      comment: 'Great content and very well organized. The internet safety section was particularly valuable for me.'
    }
  ];

  const handleEnroll = () => {
    if (!user) {
      setCurrentView('login');
      showToast('Please log in to enroll in a course.', 'warning');
      return;
    }
    try {
      setEnrolled(true);
      // Here you would call your enrollment API
      showToast('Enrolled in course successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error enrolling in course. Please try again.', 'error');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('courses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(course.rating)}
                    <span className="font-medium text-gray-900">{course.rating}</span>
                    <span>({course.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{course.instructor.name}</p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'curriculum', label: 'Curriculum' },
                    { id: 'instructor', label: 'Instructor' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouLearn.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills you'll gain</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Course Curriculum</h3>
                      <span className="text-sm text-gray-500">
                        {course.lessons.length} lessons • {course.duration} hours total
                      </span>
                    </div>
                    <div className="space-y-3">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-500">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{lesson.duration} min</span>
                            </div>
                            {lesson.is_free && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Free
                              </span>
                            )}
                            <button className="text-blue-600 hover:text-blue-700">
                              <Play className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{course.instructor.name}</h3>
                        <p className="text-gray-600 mb-2">{course.instructor.bio}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{course.instructor.rating} instructor rating</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.instructor.students.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.instructor.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
                      <div className="flex items-center space-x-2">
                        {renderStars(course.rating)}
                        <span className="font-medium text-gray-900">{course.rating}</span>
                        <span className="text-gray-500">({course.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{review.user}</span>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                {course.price > 0 && (
                  <p className="text-sm text-gray-500">One-time payment</p>
                )}
              </div>

              {enrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">You're enrolled!</p>
                    <p className="text-green-600 text-sm">Start learning now</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Continue Learning
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
                >
                  {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                </button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium text-gray-900 capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{course.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons:</span>
                  <span className="font-medium text-gray-900">{course.lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium text-gray-900">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium text-gray-900">
                    {course.certificate ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated:</span>
                  <span className="font-medium text-gray-900">{course.lastUpdated}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">This course includes:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{course.duration} hours of video content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Downloadable resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Discussion forum access</span>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Certificate of completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;