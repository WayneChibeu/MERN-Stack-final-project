import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const mockAuthContext = {
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateProfile: async () => {},
};

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
} 