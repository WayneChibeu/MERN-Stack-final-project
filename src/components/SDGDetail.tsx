import React from 'react';
import { ArrowLeft, Target, Users, TrendingUp, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { sdgsData } from '../data/sdgs';

interface SDGDetailProps {
  sdgId: number;
  setCurrentView: (view: string) => void;
}

const SDGDetail: React.FC<SDGDetailProps> = ({ sdgId, setCurrentView }) => {
  const sdg = sdgsData.find(s => s.id === sdgId);
  
  if (!sdg) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = LucideIcons[sdg.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: sdg.color }}
            >
                          <IconComponent className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{sdg.title}</h1>
              <p className="text-gray-600">Goal {sdg.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Goal</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{sdg.description}</p>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-700">Global Progress</span>
                  <span className="text-2xl font-bold text-gray-900">{sdg.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${sdg.progress}%`,
                      backgroundColor: sdg.color 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Targets</h2>
              <div className="space-y-4">
                {sdg.targets.map((target, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Progress Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900">{sdg.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Targets</span>
                  </div>
                  <span className="font-semibold text-gray-900">{sdg.targets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Active Projects</span>
                  </div>
                  <span className="font-semibold text-gray-900">{Math.floor(Math.random() * 100) + 20}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Take Action</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('projects')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Browse Related Projects
                </button>
                <button
                  onClick={() => setCurrentView('create-project')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create New Project
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learn More</h3>
              <div className="space-y-3">
                <a
                  href={`https://sdgs.un.org/goals/goal${sdg.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">UN Official Page</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href={`https://unstats.un.org/sdgs/report/2023/goal-${sdg.id.toString().padStart(2, '0')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">Progress Report</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDGDetail;