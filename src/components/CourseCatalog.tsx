import React, { useState } from 'react';
import { Search, Filter, BookOpen, Users, Clock, Star, Play } from 'lucide-react';
import { educationCategories, courseSubjects } from '../data/sdg4';

interface CourseCatalogProps {
  setCurrentView: (view: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ setCurrentView, setSelectedCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Mock courses data
  const mockCourses = [
    {
      id: '1',
      title: 'Digital Literacy Fundamentals',
      description: 'Learn essential digital skills for the modern world including computer basics, internet safety, and digital communication.',
      instructor: 'Dr. Sarah Johnson',
      instructor_avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'digital',
      subject: 'Technology',
      level: 'beginner',
      duration: 40,
      price: 0,
      rating: 4.8,
      students: 1234,
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 12,
      certificate: true
    },
    {
      id: '2',
      title: 'Mathematics for Primary Education',
      description: 'Comprehensive mathematics curriculum designed for primary school students covering arithmetic, geometry, and problem-solving.',
      instructor: 'Prof. Michael Chen',
      instructor_avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'primary',
      subject: 'Mathematics',
      level: 'beginner',
      duration: 60,
      price: 49,
      rating: 4.9,
      students: 892,
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 18,
      certificate: true
    },
    {
      id: '3',
      title: 'Environmental Science & Sustainability',
      description: 'Explore environmental challenges and sustainable solutions while learning about climate change, conservation, and green technologies.',
      instructor: 'Dr. Amara Okafor',
      instructor_avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'secondary',
      subject: 'Environmental Studies',
      level: 'intermediate',
      duration: 35,
      price: 79,
      rating: 4.7,
      students: 567,
      image: 'https://images.pexels.com/photos/8926558/pexels-photo-8926558.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 10,
      certificate: true
    },
    {
      id: '4',
      title: 'Adult Literacy Program',
      description: 'Comprehensive reading and writing program designed for adult learners to develop essential literacy skills.',
      instructor: 'Maria Rodriguez',
      instructor_avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'adult',
      subject: 'Language Arts',
      level: 'beginner',
      duration: 50,
      price: 0,
      rating: 4.6,
      students: 2341,
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 15,
      certificate: true
    },
    {
      id: '5',
      title: 'Vocational Skills: Web Development',
      description: 'Learn practical web development skills including HTML, CSS, and JavaScript to start your career in tech.',
      instructor: 'James Wilson',
      instructor_avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'vocational',
      subject: 'Technology',
      level: 'intermediate',
      duration: 120,
      price: 199,
      rating: 4.8,
      students: 445,
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 24,
      certificate: true
    },
    {
      id: '6',
      title: 'Financial Literacy for Everyone',
      description: 'Essential financial skills including budgeting, saving, investing, and understanding credit and loans.',
      instructor: 'Dr. Lisa Park',
      instructor_avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'adult',
      subject: 'Financial Literacy',
      level: 'beginner',
      duration: 25,
      price: 39,
      rating: 4.5,
      students: 1876,
      image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=500',
      lessons: 8,
      certificate: true
    }
  ];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesSubject && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const getCategoryData = (categoryId: string) => {
    return educationCategories.find(cat => cat.id === categoryId);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Catalog</h1>
          <p className="text-gray-600">
            Discover quality education courses designed to support SDG 4 and promote lifelong learning.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {educationCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {courseSubjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedCourses.length} of {mockCourses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map(course => {
            const categoryData = getCategoryData(course.category);
            return (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: categoryData?.color || '#6B7280' }}
                    >
                      {categoryData?.name || 'Course'}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">{course.subject}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={course.instructor_avatar}
                      alt={course.instructor}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.students})</span>
                    </div>
                    {course.certificate && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">Certificate</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all courses.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSubject('all');
                setSelectedLevel('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;