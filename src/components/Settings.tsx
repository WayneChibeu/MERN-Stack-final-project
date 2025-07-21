import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, User, Key, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();

  const settingsSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      to: '/settings/notifications'
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: User,
      to: '/profile'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password and account security settings',
      icon: Shield,
      to: '/settings/security'
    },
    {
      id: 'language',
      title: 'Language & Region',
      description: 'Set your preferred language and timezone',
      icon: Globe,
      to: '/settings/language'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-6 w-6 text-gray-400" />
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  to={section.to}
                  className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 