// Central API configuration: single source of truth for frontend API/socket URLs
// This module is defensive: tests or some environments may not provide `import.meta.env`.
// We check multiple places in order: import.meta.env, process.env, then a sensible default.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let envFromImportMeta: any;
try {
  // access import.meta.env safely; in some test runners this may throw
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  envFromImportMeta = (import.meta as any).env;
} catch {
  envFromImportMeta = undefined;
}

const RAW_API = (envFromImportMeta && envFromImportMeta.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) ||
  'http://localhost:3001/api';

// Ensure API_URL always ends without a trailing slash
export const API_URL = (RAW_API as string).replace(/\/$/, '');

// Socket URL: remove trailing /api if present and convert http -> ws
const socketBase = API_URL.replace(/\/api$/, '');
export const SOCKET_URL = socketBase.replace(/^http/, 'ws');

export default {
  API_URL,
  SOCKET_URL,
};
