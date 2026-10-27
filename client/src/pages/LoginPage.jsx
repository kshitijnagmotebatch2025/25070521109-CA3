import { useState } from 'react';
import { login, register } from '../services/authService.js';

export default function LoginPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = mode === 'login' ? await login(form) : await register(form);
      onAuthenticated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand auth-brand"><span className="brand-mark" aria-hidden="true">▥</span><span>Shelf</span></div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your shelf'}</h1>
        <p className="sub">{mode === 'login' ? 'Log in to access your personal library.' : 'Create an account to keep your books private and synced.'}</p>
        <form className="form" onSubmit={submit}>
          {mode === 'register' && (
            <label className="field"><span>Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
          )}
          <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
          <label className="field"><span>Password</span><input required minLength={mode === 'register' ? 8 : undefined} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'New to Shelf? Create an account' : 'Already have an account? Log in'}
        </button>
      </section>
    </main>
  );
}
