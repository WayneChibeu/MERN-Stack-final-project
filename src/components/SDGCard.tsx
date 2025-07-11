import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SDG } from '../types';

interface SDGCardProps {
  sdg: SDG;
  onClick: () => void;
}

const SDGCard: React.FC<SDGCardProps> = ({ sdg, onClick }) => {
  const IconComponent = LucideIcons[sdg.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={onClick}
    >
      <div
        className="h-4 rounded-t-xl"
        style={{ backgroundColor: sdg.color }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: sdg.color }}
            >
              {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 leading-tight">{sdg.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Goal {sdg.id}</p>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{sdg.description}</p>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Global Progress</span>
            <span className="text-sm font-bold text-gray-800">{sdg.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${sdg.progress}%`,
                backgroundColor: sdg.color 
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{sdg.targets.length} targets</span>
          <button
            className="text-sm font-medium hover:underline transition-colors"
            style={{ color: sdg.color }}
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SDGCard;