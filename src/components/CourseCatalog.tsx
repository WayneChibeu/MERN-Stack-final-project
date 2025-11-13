import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Users, Clock, Star, Play } from 'lucide-react';
import { educationCategories, courseSubjects } from '../data/sdg4';
import SkeletonCourseCard from './SkeletonCourseCard';
import { apiFetch } from '../utils/apiFetch';

interface CourseCatalogProps {
  setCurrentView: (view: string) => void;
  setSelectedCourse: (courseId: string) => void;
}

interface Course {
  _id: string;
  id?: string;
  title: string;
  description: string;
  instructor_id: { name: string; email: string; avatar?: string };
  category: string;
  subject: string;
  level: string;
  duration: number;
  price: number;
  rating: number;
  students_count: number;
  image_url: string;
  lessons: number;
  certificate: boolean;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ setCurrentView, setSelectedCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (selectedCategory !== 'all') query.append('category', selectedCategory);
        if (selectedSubject !== 'all') query.append('subject', selectedSubject);
        if (selectedLevel !== 'all') query.append('level', selectedLevel);
        if (searchTerm) query.append('search', searchTerm);
        query.append('sortBy', sortBy);

        const data: Course[] = await apiFetch(`/courses?${query.toString()}`);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchTerm, selectedCategory, selectedSubject, selectedLevel, sortBy]);

  const getCategoryData = (categoryId: string) => {
    return educationCategories.find(cat => cat.id === categoryId);
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentView('course-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding section">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Catalog</h1>
          <p className="text-gray-600 leading-relaxed">
            Discover quality education courses designed to support SDG 4 and promote lifelong learning.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
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
          <p className="text-gray-600 leading-relaxed">
            Showing {filteredCourses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid-responsive">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCourseCard key={idx} />
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => {
            const categoryData = getCategoryData(course.category);
            return (
              <div 
                key={course._id || course.id} 
                  className="card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleCourseClick(course._id || course.id || '')}
              >
                <div className="relative">
                  <img
                    src={course.image_url || 'https://via.placeholder.com/500x300'}
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
                    <p className="text-gray-600 text-small mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={course.instructor_id?.avatar || 'https://via.placeholder.com/32'}
                      alt={course.instructor_id?.name || 'Instructor'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{course.instructor_id?.name || 'Unknown Instructor'}</span>
                  </div>

                    <div className="flex items-center justify-between text-small text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{(course.students_count || 0).toLocaleString()}</span>
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
                        <span className="text-small text-gray-500">({course.students_count})</span>
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
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Try adjusting your search criteria or browse all courses.</p>
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