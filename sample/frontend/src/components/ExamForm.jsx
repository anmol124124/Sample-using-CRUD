import React, { useState } from 'react';
import { getAuth } from '../auth';

const API = import.meta.env.VITE_API_URL || '';

export default function ExamForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const auth = getAuth();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (description) fd.append('description', description);
      if (scheduledAt) fd.append('scheduled_at', new Date(scheduledAt).toISOString());
      if (file) fd.append('attachment', file);

      const res = await fetch(`${API}/api/exams`, {
        method: 'POST',
        headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
        body: fd
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      onCreated();
      setTitle('');
      setDescription('');
      setScheduledAt('');
      setFile(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Create Exam</button>
    </form>
  );
}