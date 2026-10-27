export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
