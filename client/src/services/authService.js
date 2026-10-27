const BASE = (import.meta.env.VITE_API_URL || '') + '/api/auth';

async function request(path, data) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the server is running on port 5000.');
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error((body && body.message) || `Request failed (${res.status})`);
  return body.data;
}

export const login = (data) => request('/login', data);
export const register = (data) => request('/register', data);
