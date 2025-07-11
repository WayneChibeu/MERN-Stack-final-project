import React from 'react';
import { TrendingUp, Users, Target, Globe } from 'lucide-react';
import { sdgsData } from '../data/sdgs';
import SDGCard from './SDGCard';

interface DashboardProps {
  setCurrentView: (view: string) => void;
  setSelectedSDG: (sdg: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, setSelectedSDG }) => {
  const totalProgress = Math.round(sdgsData.reduce((sum, sdg) => sum + sdg.progress, 0) / sdgsData.length);
  const criticalGoals = sdgsData.filter(sdg => sdg.progress < 50).length;
  const onTrackGoals = sdgsData.filter(sdg => sdg.progress >= 70).length;

  const handleSDGClick = (sdgId: number) => {
    setSelectedSDG(sdgId);
    setCurrentView('sdg-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Global Goals for Sustainable Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Track progress, contribute to projects, and help achieve the 17 Sustainable Development Goals by 2030
            </p>
            <button
              onClick={() => setCurrentView('projects')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Projects
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900">{totalProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Track Goals</p>
                <p className="text-3xl font-bold text-green-600">{onTrackGoals}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Goals</p>
                <p className="text-3xl font-bold text-red-600">{criticalGoals}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-purple-600">1,247</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* SDGs Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The 17 Sustainable Development Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sdgsData.map((sdg) => (
              <SDGCard 
                key={sdg.id} 
                sdg={sdg} 
                onClick={() => handleSDGClick(sdg.id)}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of changemakers working towards a sustainable future. Create a project, 
            contribute to existing initiatives, or track your personal SDG progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('projects')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Projects
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;