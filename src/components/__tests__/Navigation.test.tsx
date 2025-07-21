import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navigation from '../Navigation';
import { renderWithProviders } from './test-utils';

describe('Navigation', () => {
  it('renders the navigation bar', () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
}); 