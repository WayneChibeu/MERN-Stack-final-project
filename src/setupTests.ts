import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// If tests need environment variables, prefer using process.env or configure them
// via the test runner (vitest config). Avoid mutating import.meta here because
// it can interfere with ESM/module runtime and React's internals.

// No need to mock AuthContext - the real one has built-in test fallbacks
// See AuthContext.tsx for the IS_TEST logic