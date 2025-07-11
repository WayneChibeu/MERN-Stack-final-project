import React, { useState } from 'react';
import { User, Mail, Calendar, Award, BookOpen, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  setCurrentView: (view: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate educator committed to quality education and lifelong learning.',
    location: 'Global',
    website: '',
    linkedin: '',
    twitter: ''
  });

  const handleSave = () => {
    // Here you would update the user profile via API
    console.log('Saving profile:', formData);
    setIsEditing(false);
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
  };

  // Mock user statistics
  const userStats = {
    coursesEnrolled: 5,
    coursesCompleted: 2,
    certificatesEarned: 2,
    hoursLearned: 95,
    coursesCreated: user?.role === 'teacher' ? 8 : 0,
    studentsImpacted: user?.role === 'teacher' ? 2847 : 0
  };

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Completed your first course on EduConnect',
      icon: '🎓',
      earned: true,
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'Digital Literacy Champion',
      description: 'Completed 3 digital literacy courses',
      icon: '💻',
      earned: true,
      date: '2024-01-15'
    },
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
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "Digital Literacy Fundamentals"',
      date: '2024-01-20',
      icon: '✅'
    },
    {
      id: 2,
      type: 'certificate_earned',
      title: 'Earned certificate for "Adult Literacy Program"',
      date: '2024-01-18',
      icon: '🏆'
    },
    {
      id: 3,
      type: 'course_enrolled',
      title: 'Enrolled in "Environmental Science & Sustainability"',
      date: '2024-01-15',
      icon: '📚'
    },
    {
      id: 4,
      type: 'discussion_post',
      title: 'Posted in "Mathematics for Primary Education" discussion',
      date: '2024-01-12',
      icon: '💬'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex items-end space-x-6 -mt-16">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                    <p className="text-gray-600 capitalize">{user?.role}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined January 2024</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{formData.email}</p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{formData.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.website || 'Not provided'}</p>
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
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">My Learning</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Browse Courses</span>
                  </div>
                </button>
                {user?.role === 'teacher' && (
                  <button
                    onClick={() => setCurrentView('teacher-dashboard')}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
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