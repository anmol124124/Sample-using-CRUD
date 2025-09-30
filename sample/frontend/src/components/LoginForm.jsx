import React, { useState } from 'react';
import { setAuth } from '../auth';

const API = import.meta.env.VITE_API_URL || '';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        let message = 'Login failed';
        try {
          const err = await res.json();
          if (err && err.error) message = err.error;
        } catch (_) {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch (_) {}
        }
        throw new Error(message);
      }
      const data = await res.json();
      setAuth(data.token, data.user);
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '64px auto', display: 'grid', gap: 12 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button disabled={loading} type="submit">{loading ? '...' : 'Login'}</button>
    </form>
  );
}