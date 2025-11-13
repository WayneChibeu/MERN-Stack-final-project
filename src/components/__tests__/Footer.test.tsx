import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';
import { renderWithProviders } from './test-utils';

describe('Footer', () => {
  it('renders EduConnect brand', () => {
    renderWithProviders(<Footer />);
    // Use heading role to avoid matching the copyright text as well
    expect(screen.getByRole('heading', { name: /EduConnect/i })).toBeInTheDocument();
  });
}); 