import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, Award, MessageCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/apiFetch';
import ManualPaymentModal from './ManualPaymentModal';

interface CourseDetailProps {
  courseId: string | null;
  setCurrentView: (view: string) => void;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  is_free?: boolean;
  completed?: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor_id: any;
  category: string;
  subject: string;
  level: string;
  duration: number;
  price: number;
  image_url: string;
  rating: number;
  students_count: number;
  certificate: boolean;
  lessons: Lesson[];
  skills?: string[];
  requirements?: string[];
  whatYouLearn?: string[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, setCurrentView }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch course data on mount
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setIsLoadingCourse(false);
        return;
      }

      try {
        setIsLoadingCourse(true);
        const courseData: Course = await apiFetch(`/courses/${courseId}`);
        setCourse(courseData);

        // Fetch instructor data if available
        if (courseData.instructor_id) {
          try {
            const instructorData = await apiFetch(`/users/${courseData.instructor_id}`);
            setInstructor(instructorData);
          } catch (err) {
            console.error('Failed to fetch instructor:', err);
          }
        }

        // Generate sample reviews based on course rating
        const sampleReviews = [
          {
            id: '1',
            user: 'Maria Rodriguez',
            avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
            rating: 5,
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            comment: 'Excellent course! The instructor explains everything clearly and the practical exercises were very helpful.'
          },
          {
            id: '2',
            user: 'James Wilson',
            avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100',
            rating: 5,
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            comment: 'Perfect course for my needs. I gained valuable skills and feel confident applying them.'
          },
          {
            id: '3',
            user: 'Lisa Chen',
            avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
            rating: Math.ceil(courseData.rating || 4),
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            comment: 'Great content and very well organized. Highly recommend this course!'
          }
        ];
        setReviews(sampleReviews);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        showToast('Failed to load course details', 'error');
        setIsLoadingCourse(false);
      }
    };

    fetchCourseData();
  }, [courseId, showToast]);

  const handleEnrollClick = () => {
    if (!user) {
      setCurrentView('login');
      showToast('Please log in to enroll in a course.', 'warning');
      return;
    }

    if (!course) {
      showToast('Course not loaded', 'error');
      return;
    }

    if (course.price > 0) {
      setIsPaymentModalOpen(true);
    } else {
      handleEnrollSubmit();
    }
  };

  const handleEnrollSubmit = async (transactionCode?: string) => {
    if (!course) return;

    try {
      setEnrolled(true);
      // Call enrollment API
      await apiFetch('/enroll', {
        method: 'POST',
        body: JSON.stringify({
          course_id: course._id,
          transaction_code: transactionCode || '',
          payment_method: transactionCode ? 'manual_mpesa' : 'free'
        })
      });
      showToast(transactionCode ? 'Payment submitted! Waiting for approval.' : 'Enrolled in course successfully!', 'success');
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error enrolling in course. Please try again.', 'error');
      setEnrolled(false);
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

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setCurrentView('courses')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Course not found.</p>
          </div>
        </div>
      </div>
    );
  }

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
                  src={course.image_url}
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
                    <span>{(course.students_count || 0).toLocaleString()} students</span>
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
                    <span>({reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={instructor?.avatar || 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={instructor?.name || 'Instructor'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{instructor?.name || 'Course Instructor'}</p>
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
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
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
                    {course.whatYouLearn && course.whatYouLearn.length > 0 && (
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
                    )}

                    {course.skills && course.skills.length > 0 && (
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
                    )}

                    {course.requirements && course.requirements.length > 0 && (
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
                    )}
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
                          key={lesson._id}
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
                        src={instructor?.avatar || 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={instructor?.name || 'Instructor'}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{instructor?.name || 'Course Instructor'}</h3>
                        <p className="text-gray-600 mb-2">{instructor?.bio || 'Experienced instructor'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{instructor?.rating || 4.9} instructor rating</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{(instructor?.students || 0).toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{instructor?.courses || 0} courses</span>
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
                        <span className="text-gray-500">({reviews.length} reviews)</span>
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
                  onClick={handleEnrollClick}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
                >
                  {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
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
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium text-gray-900">
                    {course.certificate ? 'Yes' : 'No'}
                  </span>
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

      <ManualPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={course.price}
        phoneNumber="0712345678"
        onSubmit={handleEnrollSubmit}
        title={`Purchase ${course.title}`}
      />
    </div>
  );
};

export default CourseDetail;