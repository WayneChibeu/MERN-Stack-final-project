import React from 'react';

const SkeletonCourseCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="relative">
      <div className="w-full h-48 bg-gray-200" />
      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <div className="px-3 py-1 rounded-full bg-gray-300 text-gray-300 text-sm font-medium">
          &nbsp;
        </div>
      </div>
      {/* Price badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-gray-300 px-2 py-1 rounded text-sm">&nbsp;</div>
      </div>
    </div>
    {/* Card content skeleton */}
    <div className="p-6">
      {/* Level and subject */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="px-2 py-1 rounded bg-gray-200 text-gray-200 text-xs font-medium">&nbsp;</span>
        <span className="w-16 h-4 bg-gray-200 rounded" />
      </div>
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      {/* Description */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
      {/* Instructor */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <span className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-4 bg-gray-200 rounded" />
          <div className="w-12 h-4 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Rating and certificate */}
      <div className="flex items-center justify-between">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export default SkeletonCourseCard; 