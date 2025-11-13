import { API_URL } from '../config/api';

export interface ApiFetchOptions extends RequestInit {
  // If true, don't attach auth header even when token exists
  skipAuth?: boolean;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  }
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return text;
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  const token = localStorage.getItem('auth-token');
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  return parseResponse(res);
}

export default apiFetch;
