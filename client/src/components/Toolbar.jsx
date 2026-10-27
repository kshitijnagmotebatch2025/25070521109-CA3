import { GENRES, STATUSES } from '../services/bookService.js';

export default function Toolbar({ filters, onChange, onClear }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value });
  const active = filters.q || filters.status || filters.genre || filters.sort !== 'newest';
  return (
    <div className="toolbar" role="search">
      <input
        className="search"
        type="search"
        placeholder="Search title or author"
        value={filters.q}
        onChange={set('q')}
        aria-label="Search by title or author"
      />
      <select value={filters.status} onChange={set('status')} aria-label="Filter by status">
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select value={filters.genre} onChange={set('genre')} aria-label="Filter by genre">
        <option value="">All genres</option>
        {GENRES.map((g) => <option key={g}>{g}</option>)}
      </select>
      <select value={filters.sort} onChange={set('sort')} aria-label="Sort books">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title A–Z</option>
        <option value="author">Author A–Z</option>
        <option value="rating">Highest rated</option>
      </select>
      {active && <button className="btn btn-ghost" onClick={onClear}>Clear filters</button>}
    </div>
  );
}
