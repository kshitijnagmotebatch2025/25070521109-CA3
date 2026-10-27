import { useState } from 'react';
import Stars from './Stars.jsx';
import { GENRES, STATUSES } from '../services/bookService.js';

const blank = { title: '', author: '', genre: 'Fiction', status: 'To Read', rating: 0, pages: '', notes: '' };

function validate(v) {
  const e = {};
  if (!v.title.trim()) e.title = 'Enter a title.';
  else if (v.title.trim().length > 150) e.title = 'Keep the title under 150 characters.';
  if (!v.author.trim()) e.author = 'Enter an author.';
  else if (v.author.trim().length > 100) e.author = 'Keep the author under 100 characters.';
  if (v.pages !== '' && (!Number.isInteger(Number(v.pages)) || Number(v.pages) < 1)) e.pages = 'Pages must be a whole number of 1 or more.';
  if (v.notes.length > 1000) e.notes = 'Keep notes under 1000 characters.';
  return e;
}

export default function BookForm({ initial, onSubmit, onCancel, saving, apiError }) {
  const [values, setValues] = useState(initial ? { ...blank, ...initial, pages: initial.pages ?? '' } : blank);
  const [errors, setErrors] = useState({});
  const editing = Boolean(initial && initial._id);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre,
      status: values.status,
      rating: Number(values.rating) || 0,
      pages: values.pages === '' ? undefined : Number(values.pages),
      notes: values.notes.trim(),
    });
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <form className="panel form" onSubmit={handleSubmit} noValidate>
        <h2 id="form-title">{editing ? 'Edit book' : 'Add a book'}</h2>

        {apiError && <p className="form-error" role="alert">{apiError}</p>}

        <label className="field">
          <span>Title</span>
          <input value={values.title} onChange={set('title')} autoFocus aria-invalid={Boolean(errors.title)} />
          {errors.title && <small className="err">{errors.title}</small>}
        </label>

        <label className="field">
          <span>Author</span>
          <input value={values.author} onChange={set('author')} aria-invalid={Boolean(errors.author)} />
          {errors.author && <small className="err">{errors.author}</small>}
        </label>

        <div className="row">
          <label className="field">
            <span>Genre</span>
            <select value={values.genre} onChange={set('genre')}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={values.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Pages</span>
            <input type="number" min="1" value={values.pages} onChange={set('pages')} aria-invalid={Boolean(errors.pages)} />
            {errors.pages && <small className="err">{errors.pages}</small>}
          </label>
          <div className="field">
            <span>Rating</span>
            <Stars value={Number(values.rating)} onChange={(n) => setValues((v) => ({ ...v, rating: n }))} />
          </div>
        </div>

        <label className="field">
          <span>Notes</span>
          <textarea rows="3" value={values.notes} onChange={set('notes')} aria-invalid={Boolean(errors.notes)} />
          {errors.notes && <small className="err">{errors.notes}</small>}
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add book'}
          </button>
        </div>
      </form>
    </div>
  );
}
