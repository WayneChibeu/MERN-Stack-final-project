import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Vite's import.meta.env for tests
if (!('import' in globalThis)) {
  (globalThis as any).import = {};
}
(globalThis as any).import.meta = {
  env: {
    VITE_API_URL: 'http://localhost:3001/api',
    MODE: 'test'
  }
}; 