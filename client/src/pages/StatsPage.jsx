import { useEffect, useState } from 'react';
import { getStats } from '../services/bookService.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function StatsPage({ onGoLibrary }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    getStats()
      .then((r) => live && setStats(r.data))
      .catch((e) => live && setError(e.message))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, []);

  if (loading) return <Loader label="Calculating your stats…" />;
  if (error) return <EmptyState title="Couldn’t load stats" message={error} />;
  if (!stats || stats.total === 0) {
    return <EmptyState title="Nothing to count yet" message="Add a few books and your reading stats will appear here." actionLabel="Go to library" onAction={onGoLibrary} />;
  }

  const max = Math.max(...stats.byGenre.map((g) => g.count));
  const count = (s) => (stats.byStatus.find((x) => x.status === s) || { count: 0 }).count;

  return (
    <section>
      <div className="page-head"><h1>Reading stats</h1></div>
      <div className="stat-row">
        <div className="stat"><strong>{stats.total}</strong><span>books</span></div>
        <div className="stat"><strong>{count('Finished')}</strong><span>finished</span></div>
        <div className="stat"><strong>{count('Reading')}</strong><span>reading now</span></div>
        <div className="stat"><strong>{count('To Read')}</strong><span>to read</span></div>
        <div className="stat"><strong>{stats.averageRating || '–'}</strong><span>average rating</span></div>
        <div className="stat"><strong>{stats.totalPages.toLocaleString()}</strong><span>pages on the shelf</span></div>
      </div>
      <div className="panel genre-panel">
        <h2>Books by genre</h2>
        <ul className="bars">
          {stats.byGenre.map((g) => (
            <li key={g.genre}>
              <span className="bar-label">{g.genre}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${(g.count / max) * 100}%` }} /></span>
              <span className="bar-count">{g.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
