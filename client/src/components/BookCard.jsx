import Stars from './Stars.jsx';

const statusClass = { 'To Read': 'to-read', Reading: 'reading', Finished: 'finished' };

export default function BookCard({ book, onEdit, onDelete, busy }) {
  return (
    <article className={`book spine-${statusClass[book.status]}`}>
      <div className="book-main">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-meta">
          <span className={`pill pill-${statusClass[book.status]}`}>{book.status}</span>
          <span className="meta-text">{book.genre}{book.pages ? ` · ${book.pages} pages` : ''}</span>
        </p>
        {book.rating > 0 && <Stars value={book.rating} />}
        {book.notes && <p className="book-notes">{book.notes}</p>}
      </div>
      <div className="book-actions">
        <button className="btn btn-ghost" onClick={() => onEdit(book)} disabled={busy}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(book)} disabled={busy}>Delete</button>
      </div>
    </article>
  );
}
