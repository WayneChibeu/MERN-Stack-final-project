import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Play, Clock, Star, Globe } from 'lucide-react';
import { sdg4Data, educationCategories } from '../data/sdg4';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/apiFetch';

const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map((p: string) => p[0]).join('').toUpperCase();
};

interface ApiStats {
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  totalUsers?: number;
  totalContributions?: number;
  totalFunding?: number;
  sdgDistribution?: Array<{ _id: number; count: number }>;
}

interface Course {
  _id: string;
  id?: string;
  title: string;
  instructor_id: { name: string; email: string; avatar?: string };
  students_count: number;
  rating: number;
  duration: number;
  image_url: string;
  category: string;
}

interface CategoryWithCourses {
  id: string;
  name: string;
  description: string;
  color: string;
  courses: Course[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ title: string; value: string; change: string; icon: React.ComponentType<any>; color: string }[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<CategoryWithCourses[]>([]);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsData: ApiStats = await apiFetch('/stats');

        // Fetch all courses to get category counts and organize by category
        const allCourses: Course[] = await apiFetch('/courses?limit=1000');
        const coursesByCategory: { [key: string]: Course[] } = {};
        
        allCourses.forEach(course => {
          if (!coursesByCategory[course.category]) {
            coursesByCategory[course.category] = [];
          }
          coursesByCategory[course.category].push(course);
        });

        // Build categories with courses
        const categoriesData: CategoryWithCourses[] = educationCategories.map(cat => ({
          ...cat,
          courses: (coursesByCategory[cat.name] || []).slice(0, 3) // Show up to 3 courses per category
        }));
        setCategoriesWithCourses(categoriesData);

        const newStats = [
          {
            title: 'Active Projects',
            value: (statsData.activeProjects || 0).toString(),
            change: `+${Math.floor((statsData.activeProjects || 0) * 0.15)}`,
            icon: BookOpen,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Learners',
            value: (statsData.totalUsers || 0).toString(),
            change: `+${Math.floor((statsData.totalUsers || 0) * 0.08)}`,
            icon: Users,
            color: 'bg-green-500'
          },
          {
            title: 'Total Contributions',
            value: (statsData.totalContributions || 0).toString(),
            change: `+${Math.floor((statsData.totalContributions || 0) * 0.15)}`,
            icon: Award,
            color: 'bg-purple-500'
          },
          {
            title: 'Total Funding',
            value: `$${(statsData.totalFunding || 0).toLocaleString()}`,
            change: `+${Math.floor((statsData.totalFunding || 0) * 0.12)}%`,
            icon: Globe,
            color: 'bg-orange-500'
          }
        ];
        setStats(newStats);

        // Fetch featured courses
        const coursesData: Course[] = await apiFetch('/courses?sortBy=popular');
        setFeaturedCourses(coursesData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats([]);
        setFeaturedCourses([]);
        setCategoriesWithCourses([]);
      }
    };

    fetchDashboardData();
  }, []);

  const handleImageError = (courseId: string) => {
    setBrokenImages(prev => new Set([...prev, courseId]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="relative z-10 bg-teal-600 text-white px-8 py-6 rounded-b-2xl shadow flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="px-4 py-1 rounded-full bg-white text-teal-700 font-semibold shadow text-sm ml-4" aria-label="Student role">Student</span>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Your profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
              aria-label="Your profile"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-teal-200 flex items-center justify-center text-xl font-bold text-teal-700" aria-label="Your profile initials">
              {getInitials(user?.name ?? '')}
            </div>
          )}
        </div>
      </header>
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
              <Link
                to="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Explore Courses
              </Link>
              {user?.role === 'teacher' && (
                <Link
                  to="/teacher/create-course"
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Create Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding section">
        {/* Stats Section */}
        <div className="grid-responsive-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small font-medium dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-50" title={stat.title}>{stat.value}</p>
                  <p className="text-small text-green-600 dark:text-green-400 font-medium">{stat.change} this month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`} title={stat.title}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SDG 4 Progress */}
        <div className="card p-8 mb-12 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">SDG 4: Quality Education Progress</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Global progress towards ensuring inclusive and equitable quality education</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sdg4Data.progress}%</div>
              <div className="text-small text-gray-500 dark:text-gray-500">Global Progress</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${sdg4Data.progress}%` }}
            />
          </div>
          <div className="grid-responsive-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-50" title="Total number of out-of-school children worldwide">{sdg4Data.globalStats.outOfSchoolChildren.toLocaleString()}</div>
              <div className="text-small text-gray-600 dark:text-gray-400">Out-of-school children</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-50" title="Percentage of people globally who can read and write">{sdg4Data.globalStats.literacyRate}%</div>
              <div className="text-small text-gray-600 dark:text-gray-400">Global literacy rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-50" title="Percentage of children who complete primary school">{sdg4Data.globalStats.completionRatePrimary}%</div>
              <div className="text-small text-gray-600 dark:text-gray-400">Primary completion</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-50" title="Percentage of children who complete secondary school">{sdg4Data.globalStats.completionRateSecondary}%</div>
              <div className="text-small text-gray-600 dark:text-gray-400">Secondary completion</div>
            </div>
          </div>
        </div>

        {/* Education Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">Education Categories</h2>
          <div className="space-y-12">
            {categoriesWithCourses.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  <Link
                    to={`/courses?category=${category.name}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View All →
                  </Link>
                </div>
                
                {category.courses.length > 0 ? (
                  <div className="grid-responsive">
                    {category.courses.map((course) => (
                      <div key={course._id} className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                        <div className="relative h-40 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden flex items-center justify-center">
                          {brokenImages.has(course._id) ? (
                            <div className="flex flex-col items-center justify-center w-full h-full text-white">
                              <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                              <span className="text-sm opacity-75">{course.title}</span>
                            </div>
                          ) : (
                            <img
                              src={course.image_url}
                              alt={course.title}
                              onError={() => handleImageError(course._id)}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{course.title}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{course.duration} hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium dark:text-gray-200">{course.rating}</span>
                                <span className="text-gray-500 dark:text-gray-400">({course.students_count} students)</span>
                              </div>
                            </div>
                          </div>
                          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No courses available in this category yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Featured Courses</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View All Courses →
            </Link>
          </div>
          <div className="grid-responsive">
            {featuredCourses.map((course) => (
              <div key={course._id || course.id} className="card overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative">
                  {brokenImages.has(course._id) ? (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white opacity-50" />
                    </div>
                  ) : (
                    <img
                      src={course.image_url || 'https://via.placeholder.com/500x300'}
                      alt={course.title}
                      onError={() => handleImageError(course._id)}
                      className="w-full h-48 object-cover"
                    />
                  )}
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-small mb-4">by {course.instructor_id?.name || 'Unknown Instructor'}</p>
                  <div className="flex items-center justify-between text-small text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{(course.students_count || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration || 0} hours</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium dark:text-gray-300">{course.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <Link
              to={user ? '/my-learning' : '/register'}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user ? 'My Learning' : 'Start Learning'}
            </Link>
            {(!user || user.role === 'teacher') && (
              <Link
                to={user ? '/create-course' : '/register'}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {user ? 'Create Course' : 'Become an Educator'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;