import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';
import { renderWithProviders } from './test-utils';

describe('Footer', () => {
  it('renders EduConnect brand', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/EduConnect/i)).toBeInTheDocument();
  });
}); 