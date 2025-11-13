import { describe, it } from 'vitest';
import Navigation from '../Navigation';
import { renderWithProviders } from './test-utils';

describe('Navigation', () => {
  it.skip('renders the navigation bar', () => {
    renderWithProviders(<Navigation />);
    // expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
}); 