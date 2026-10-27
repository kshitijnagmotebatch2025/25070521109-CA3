export default function Stars({ value = 0, onChange }) {
  const interactive = typeof onChange === 'function';
  return (
    <div className="stars" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        if (!interactive) return <span key={n} className={filled ? 'star on' : 'star'}>★</span>;
        return (
          <button
            type="button"
            key={n}
            className={filled ? 'star on star-btn' : 'star star-btn'}
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={filled}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
