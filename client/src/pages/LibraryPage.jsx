import { useCallback, useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/bookService.js';
import Toolbar from '../components/Toolbar.jsx';
import BookCard from '../components/BookCard.jsx';
import BookForm from '../components/BookForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

const DEFAULT_FILTERS = { q: '', status: '', genre: '', sort: 'newest' };

export default function LibraryPage({ notify }) {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formBook, setFormBook] = useState(null);   // null = closed, {} = new, book = edit
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await getBooks(filters);
      setBooks(res.data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openNew = () => { setFormBook(null); setFormError(''); setFormOpen(true); };
  const openEdit = (book) => { setFormBook(book); setFormError(''); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setFormBook(null); };

  const handleSave = async (data) => {
    setSaving(true);
    setFormError('');
    try {
      if (formBook && formBook._id) {
        await updateBook(formBook._id, data);
        notify('success', 'Book updated');
      } else {
        await createBook(data);
        notify('success', 'Book added');
      }
      closeForm();
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(toDelete._id);
      notify('success', 'Book deleted');
      setToDelete(null);
      await load();
    } catch (err) {
      notify('error', err.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filters.q || filters.status || filters.genre;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Your library</h1>
          <p className="sub">{loading ? ' ' : `${books.length} ${books.length === 1 ? 'book' : 'books'}${filtered ? ' match your filters' : ''}`}</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>Add book</button>
      </div>

      <Toolbar filters={filters} onChange={setFilters} onClear={() => setFilters(DEFAULT_FILTERS)} />

      {loading && <Loader label="Loading your books…" />}

      {!loading && loadError && (
        <div className="empty">
          <h3>Couldn’t load your books</h3>
          <p>{loadError}</p>
          <button className="btn btn-primary" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !loadError && books.length === 0 && (
        filtered ? (
          <EmptyState title="No matching books" message="Try a different search or clear the filters." actionLabel="Clear filters" onAction={() => setFilters(DEFAULT_FILTERS)} />
        ) : (
          <EmptyState title="Your shelf is empty" message="Add the first book you’re reading or planning to read." actionLabel="Add book" onAction={openNew} />
        )
      )}

      {!loading && !loadError && books.length > 0 && (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b._id} book={b} onEdit={openEdit} onDelete={setToDelete} busy={deleting} />
          ))}
        </div>
      )}

      {formOpen && (
        <BookForm initial={formBook} onSubmit={handleSave} onCancel={closeForm} saving={saving} apiError={formError} />
      )}
      {toDelete && (
        <ConfirmDialog book={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} busy={deleting} />
      )}
    </section>
  );
}
