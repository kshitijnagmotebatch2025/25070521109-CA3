const BASE = (import.meta.env.VITE_API_URL || '') + '/api/books';

async function request(path = '', options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('shelf_token') ? { Authorization: `Bearer ${localStorage.getItem('shelf_token')}` } : {}),
      },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the server is running on port 5000.');
  }
  let body = null;
  try { body = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok) throw new Error((body && body.message) || `Request failed (${res.status})`);
  return body;
}

const toQuery = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const getBooks = (params = {}) => request(toQuery(params));
export const getStats = () => request('/stats');
export const createBook = (data) => request('', { method: 'POST', body: JSON.stringify(data) });
export const updateBook = (id, data) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBook = (id) => request(`/${id}`, { method: 'DELETE' });

export const GENRES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Technology', 'Other'];
export const STATUSES = ['To Read', 'Reading', 'Finished'];
