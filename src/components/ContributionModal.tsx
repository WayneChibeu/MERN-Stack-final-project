import React, { useState, useRef, useEffect } from 'react';
import { X, DollarSign, Clock, Package, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Project } from '../types';

interface ContributionModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContributionModal: React.FC<ContributionModalProps> = ({ project, isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contributionData, setContributionData] = useState({
    type: 'monetary' as 'monetary' | 'time' | 'resource',
    amount: 0,
    description: ''
  });

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Auto-focus the first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])', 'input:not([type=hidden]):not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];
    const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(','));
    if (!focusableEls.length) return;
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    }
    const modalEl = modalRef.current;
    if (!modalEl) return undefined;
    modalEl.addEventListener('keydown', handleKeyDown);
    return () => modalEl.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        showToast('Please log in to contribute.', 'warning');
        setLoading(false);
        return;
      }

      if (!project) {
        showToast('Project not found.', 'error');
        setLoading(false);
        return;
      }

      // Validate contribution data
      if (contributionData.type === 'monetary' && contributionData.amount <= 0) {
        showToast('Please enter a valid amount.', 'error');
        setLoading(false);
        return;
      }

      if (contributionData.type !== 'monetary' && !contributionData.description.trim()) {
        showToast('Please describe your contribution.', 'error');
        setLoading(false);
        return;
      }

      const contributionPayload = {
        project_id: project.id,
        type: contributionData.type,
        amount: contributionData.type === 'monetary' ? contributionData.amount : 0,
        description: contributionData.description
      };

      console.log('Submitting contribution:', contributionPayload);
      // Here you would call your API to submit the contribution
      
      showToast(`Thank you for your ${contributionData.type} contribution to "${project.title}"!`, 'success');
      onClose();
      setContributionData({ type: 'monetary', amount: 0, description: '' });
    } catch (error) {
      console.error('Error submitting contribution:', error);
      showToast('Error submitting contribution. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContributionData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="presentation">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contribution-modal-title"
        aria-describedby="contribution-modal-desc"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="contribution-modal-title" className="text-xl font-bold text-gray-900">Contribute to Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close contribution modal"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Info */}
        <div className="p-6 border-b border-gray-200" id="contribution-modal-desc">
          <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        </div>

        {/* Contribution Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contribution Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contribution Type *
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  ref={firstInputRef}
                  type="radio"
                  name="type"
                  value="monetary"
                  checked={contributionData.type === 'monetary'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Monetary Donation</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="time"
                  checked={contributionData.type === 'time'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Volunteer Time</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="resource"
                  checked={contributionData.type === 'resource'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Package className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Resources/Materials</span>
              </label>
            </div>
          </div>

          {/* Amount (for monetary) */}
          {contributionData.type === 'monetary' && (
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  value={contributionData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter the amount you wish to contribute. Minimum $0.01.</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              {contributionData.type === 'monetary' ? 'Message (Optional)' : 'Description *'}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                contributionData.type === 'monetary' 
                  ? 'Add a message with your donation...'
                  : contributionData.type === 'time'
                  ? 'Describe how you can help (e.g., "I can volunteer 5 hours per week for website development")'
                  : 'Describe the resources you can provide (e.g., "I can donate 10 laptops for the computer lab")'
              }
              value={contributionData.description}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Describe your contribution. For time/resources, be as specific as possible.</p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>{loading ? 'Submitting...' : 'Submit Contribution'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal; 