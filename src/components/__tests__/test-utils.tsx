import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AuthContextType } from '../../types';

// Stub auth value for tests
const stubAuthValue: AuthContextType = {
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={stubAuthValue}>
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>
  );
} 