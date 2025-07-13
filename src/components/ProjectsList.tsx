import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { sdgsData } from '../data/sdgs';
import { Project } from '../types';
import { useToast } from '../context/ToastContext';
import ContributionModal from './ContributionModal';

interface ProjectsListProps {
  setCurrentView: (view: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ setCurrentView }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  // Mock projects data
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Clean Water Initiative - Rural Kenya',
      description: 'Installing water purification systems in rural communities to provide access to clean drinking water.',
      sdg_id: 6,
      creator_id: 'user1',
      status: 'active',
      progress: 75,
      target_amount: 50000,
      current_amount: 37500,
      image_url: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '2',
      title: 'Solar Power for Schools',
      description: 'Providing solar energy solutions to schools in underserved communities.',
      sdg_id: 7,
      creator_id: 'user2',
      status: 'active',
      progress: 45,
      target_amount: 75000,
      current_amount: 33750,
      image_url: 'https://images.pexels.com/photos/9800025/pexels-photo-9800025.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    {
      id: '3',
      title: 'Urban Farming Initiative',
      description: 'Creating sustainable urban gardens to combat food insecurity in cities.',
      sdg_id: 2,
      creator_id: 'user3',
      status: 'active',
      progress: 60,
      target_amount: 25000,
      current_amount: 15000,
      image_url: 'https://images.pexels.com/photos/2252602/pexels-photo-2252602.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2024-01-08T00:00:00Z',
      updated_at: '2024-01-16T00:00:00Z'
    },
    {
      id: '4',
      title: 'Education for All - Digital Literacy',
      description: 'Providing digital literacy training to underprivileged communities.',
      sdg_id: 4,
      creator_id: 'user4',
      status: 'active',
      progress: 30,
      target_amount: 40000,
      current_amount: 12000,
      image_url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-12T00:00:00Z'
    },
    {
      id: '5',
      title: 'Ocean Cleanup Project',
      description: 'Removing plastic waste from oceans and coastal areas.',
      sdg_id: 14,
      creator_id: 'user5',
      status: 'active',
      progress: 85,
      target_amount: 100000,
      current_amount: 85000,
      image_url: 'https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-19T00:00:00Z'
    },
    {
      id: '6',
      title: 'Reforestation Campaign',
      description: 'Planting trees to combat deforestation and climate change.',
      sdg_id: 15,
      creator_id: 'user6',
      status: 'completed',
      progress: 100,
      target_amount: 30000,
      current_amount: 30000,
      image_url: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=500',
      created_at: '2023-12-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSDG = selectedSDG === null || project.sdg_id === selectedSDG;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesSDG && matchesStatus;
  });

  const getSDGData = (sdgId: number) => {
    return sdgsData.find(sdg => sdg.id === sdgId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleContribute = (project: Project) => {
    setSelectedProject(project);
    setIsContributionModalOpen(true);
  };

  const closeContributionModal = () => {
    setIsContributionModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">SDG Projects</h1>
            <button
              onClick={() => setCurrentView('create-project')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>
          <p className="text-gray-600">
            Discover and contribute to projects making a real impact on the Sustainable Development Goals.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={selectedSDG || ''}
                onChange={(e) => setSelectedSDG(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">All SDGs</option>
                {sdgsData.map(sdg => (
                  <option key={sdg.id} value={sdg.id}>
                    {sdg.id}. {sdg.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const sdgData = getSDGData(project.sdg_id);
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: sdgData?.color || '#6B7280' }}
                    >
                      SDG {project.sdg_id}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: sdgData?.color || '#6B7280'
                        }}
                      />
                    </div>
                  </div>

                  {project.target_amount && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Raised</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ${project.current_amount?.toLocaleString()} / ${project.target_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 50) + 10} supporters</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleContribute(project)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new project.</p>
            <button
              onClick={() => setCurrentView('create-project')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Project
            </button>
          </div>
        )}
      </div>
      
      {/* Contribution Modal */}
      <ContributionModal
        project={selectedProject}
        isOpen={isContributionModalOpen}
        onClose={closeContributionModal}
      />
    </div>
  );
};

export default ProjectsList;