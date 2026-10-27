export default function ConfirmDialog({ book, onConfirm, onCancel, busy }) {
  return (
    <div className="overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="panel confirm">
        <h2 id="confirm-title">Delete this book?</h2>
        <p>“{book.title}” will be removed from your library. This can’t be undone.</p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Keep book</button>
          <button className="btn btn-danger-solid" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete book'}
          </button>
        </div>
      </div>
    </div>
  );
}
