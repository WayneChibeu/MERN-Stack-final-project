import React, { useState } from 'react';
import { ArrowLeft, Save, Upload, DollarSign, Target, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sdgsData } from '../data/sdgs';
import Button from './ui/Button';

interface CreateProjectProps {
  setCurrentView: (view: string) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sdg_id: '',
    target_amount: 0,
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.sdg_id) {
        showToast('Please fill in all required fields.', 'error');
        setLoading(false);
        return;
      }

      const projectPayload = {
        ...formData,
        sdg_id: parseInt(formData.sdg_id),
        creator_id: user?.id
      };

      console.log('Creating project:', projectPayload);
      // Here you would call your API to create the project
      
      showToast('Project created successfully!', 'success');
      setCurrentView('projects');
    } catch (error) {
      console.error('Error creating project:', error);
      showToast('Error creating project. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target_amount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setCurrentView('projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm sm:text-base">Back to Projects</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New SDG Project</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Start a project that makes a real impact on the Sustainable Development Goals.
          </p>
        </div>

        {/* Project Form */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Describe your project and its impact"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* SDG Selection */}
            <div>
              <label htmlFor="sdg_id" className="block text-sm font-medium text-gray-700 mb-2">
                Sustainable Development Goal *
              </label>
              <select
                id="sdg_id"
                name="sdg_id"
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                value={formData.sdg_id}
                onChange={handleInputChange}
              >
                <option value="">Select an SDG</option>
                {sdgsData.map(sdg => (
                  <option key={sdg.id} value={sdg.id}>
                    {sdg.id}. {sdg.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Amount */}
            <div>
              <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="target_amount"
                  name="target_amount"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="0.00"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Set a fundraising goal for your project. Leave at 0 if not applicable.</p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Project Image URL
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image that represents your project (optional).</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentView('projects')}
                fullWidth={false}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                icon={Save}
                fullWidth={false}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 