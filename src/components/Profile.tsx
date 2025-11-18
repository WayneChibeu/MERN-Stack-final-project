import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Calendar, Award, BookOpen, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/apiFetch';
import Button from './ui/Button';

// Helper function to format join date
const getJoinedDate = (created_at?: string): string => {
  if (!created_at) return 'Joined recently';
  const date = new Date(created_at);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
};


interface ProfileProps {
  setCurrentView: (view: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    hoursLearned: 0,
    coursesCreated: 0,
    studentsImpacted: 0
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate educator committed to quality education and lifelong learning.',
    location: 'Global',
    website: '',
    linkedin: '',
    twitter: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar file selection and upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Uploading avatar with token:', token.substring(0, 20) + '...');
      
      // Define the API URL using your environment variable
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      // Send the request to the full backend URL
      const response = await fetch(`${API_URL}/users/avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Avatar upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Avatar upload error response:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      setAvatarPreview(data.avatar);
      showToast('Avatar uploaded successfully', 'success');
    } catch (error) {
      console.error('Avatar upload error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to upload avatar', 'error');
      // Reset preview on error
      setAvatarPreview(user?.avatar || '');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fetch user statistics and activity on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch enrollments
        const enrollments: any[] = await apiFetch('/user/enrolled-courses');
        const completed = enrollments.filter(e => e.status === 'completed').length;
        const inProgress = enrollments.filter(e => e.status === 'enrolled' || e.status === 'in-progress').length;
        const totalHours = Math.round(enrollments.reduce((sum, e) => sum + (e.time_spent || 0), 0) / 60);

        setUserStats({
          coursesEnrolled: inProgress,
          coursesCompleted: completed,
          certificatesEarned: completed,
          hoursLearned: totalHours,
          coursesCreated: user?.role === 'teacher' ? 0 : 0,
          studentsImpacted: user?.role === 'teacher' ? 0 : 0
        });

        // Set achievements based on actual data
        const earnedAchievements = [];
        if (completed > 0) {
          earnedAchievements.push({
            id: 1,
            title: 'First Course Completed',
            description: 'Completed your first course on EduConnect',
            icon: '🎓',
            earned: true,
            date: new Date().toISOString().split('T')[0]
          });
        }
        if (completed >= 3) {
          earnedAchievements.push({
            id: 2,
            title: 'Digital Literacy Champion',
            description: 'Completed 3 digital literacy courses',
            icon: '💻',
            earned: true,
            date: new Date().toISOString().split('T')[0]
          });
        }
        earnedAchievements.push(
          {
            id: 3,
            title: 'Learning Streak',
            description: 'Learned for 7 consecutive days',
            icon: '🔥',
            earned: false,
            date: null
          },
          {
            id: 4,
            title: 'Community Helper',
            description: 'Helped 10 fellow learners in discussions',
            icon: '🤝',
            earned: false,
            date: null
          }
        );
        setAchievements(earnedAchievements);

        // Set recent activity based on enrollments
        const activity = enrollments.slice(0, 4).map((enrollment, idx) => ({
          id: idx + 1,
          type: 'course_enrolled',
          title: `Enrolled in "${enrollment.course_id?.title || 'Course'}"`,
          date: new Date(enrollment.enrollment_date).toISOString().split('T')[0],
          icon: '📚'
        }));
        setRecentActivity(activity);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleSave = () => {
    try {
      // Here you would update the user profile via API
      console.log('Saving profile:', formData);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error updating profile. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Passionate educator committed to quality education and lifelong learning.',
      location: 'Global',
      website: '',
      linkedin: '',
      twitter: ''
    });
    setIsEditing(false);
    // reset avatar preview to user's current avatar
    setAvatarPreview(user?.avatar || '');
  };

// --- HELPER START ---
  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    
    // Get backend URL (remove '/api' from the end if it's there)
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace('/api', '');
    
    // Remove leading slash from path if it exists to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${baseUrl}/${cleanPath}`;
  };
  // --- HELPER END ---

  // Avatar upload UI/handler removed for now (not used)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24 sm:h-32"></div>
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-12 sm:-mt-16">
              <div className="relative">
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mx-auto sm:mx-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={getFullImageUrl(avatarPreview)}
                      alt={user?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-md hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex-1 pb-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.name}</h1>
                    <p className="text-gray-600 capitalize text-sm sm:text-base">{user?.role}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{getJoinedDate(user?.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    icon={Edit}
                    size="md"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Profile Information</h2>
                {isEditing && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={handleSave}
                      variant="secondary"
                      icon={Save}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      icon={X}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300">
                        {avatarPreview ? (
                          <img
                            src={getFullImageUrl(avatarPreview)}
                            alt={user?.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                      >
                        {isUploadingAvatar ? 'Uploading...' : 'Change Picture'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base">{formData.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{formData.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base">{formData.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base">{formData.website || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-green-600 mt-1">
                            Earned on {achievement.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Courses Enrolled</span>
                  </div>
                  <span className="font-medium text-gray-900">{userStats.coursesEnrolled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Courses Completed</span>
                  </div>
                  <span className="font-medium text-gray-900">{userStats.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Certificates Earned</span>
                  </div>
                  <span className="font-medium text-gray-900">{userStats.certificatesEarned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-600">Hours Learned</span>
                  </div>
                  <span className="font-medium text-gray-900">{userStats.hoursLearned}</span>
                </div>
                {user?.role === 'teacher' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm text-gray-600">Courses Created</span>
                      </div>
                      <span className="font-medium text-gray-900">{userStats.coursesCreated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-pink-500" />
                        <span className="text-sm text-gray-600">Students Impacted</span>
                      </div>
                      <span className="font-medium text-gray-900">{userStats.studentsImpacted.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('my-learning')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">My Learning</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Browse Courses</span>
                  </div>
                </button>
                {user?.role === 'teacher' && (
                  <button
                    onClick={() => setCurrentView('teacher-dashboard')}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Teacher Dashboard</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;