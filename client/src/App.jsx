import { useCallback, useState } from 'react';
import LibraryPage from './pages/LibraryPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const [page, setPage] = useState('library');
  const [toast, setToast] = useState(null);

  const notify = useCallback((type, message) => setToast({ type, message, id: Date.now() }), []);
  const closeToast = useCallback(() => setToast(null), []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="6" width="4" height="20" fill="#E8A317" /><rect x="13" y="9" width="4" height="17" fill="#135D66" /><rect x="19" y="6" width="6" height="20" fill="#7FB8AB" /></svg>
          <span>Shelf</span>
        </div>
        <nav aria-label="Main">
          <button className={page === 'library' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('library')} aria-current={page === 'library' ? 'page' : undefined}>Library</button>
          <button className={page === 'stats' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('stats')} aria-current={page === 'stats' ? 'page' : undefined}>Stats</button>
        </nav>
      </header>
      <main className="content">
        {page === 'library' ? <LibraryPage notify={notify} /> : <StatsPage onGoLibrary={() => setPage('library')} />}
      </main>
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
