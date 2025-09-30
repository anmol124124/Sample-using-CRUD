import React, { useEffect, useState } from 'react';
import { getAuth, clearAuth } from '../auth';
import ProtectedRoute from './ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import ExamForm from './ExamForm';

const API = import.meta.env.VITE_API_URL || '';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const auth = getAuth();
  const nav = useNavigate();

  async function load() {
    const res = await fetch(`${API}/api/exams`, { headers: { Authorization: `Bearer ${auth?.token || ''}` } });
    if (!res.ok) return;
    setExams(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    const res = await fetch(`${API}/api/exams/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${auth?.token || ''}` } });
    if (res.ok) setExams(exams.filter(e => e.id !== id));
  }

  async function logout() {
    await fetch(`${API}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${auth?.token || ''}` } });
    clearAuth();
    nav('/login');
  }

  async function downloadFile(path) {
    try {
      const res = await fetch(`${API}/api/files/download?path=${encodeURIComponent(path)}`, {
        headers: { Authorization: `Bearer ${auth?.token || ''}` }
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') || '';
      let filename = path.split('/').pop() || 'download';
      const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      if (match) filename = decodeURIComponent(match[1] || match[2] || filename);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (_) {}
  }

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: 900, margin: '24px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Exams</h2>
          <div>
            <span style={{ marginRight: 12 }}>{auth?.user.email} ({auth?.user.role})</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {(auth?.user.role === 'ADMIN' || auth?.user.role === 'TEACHER') && (
          <ExamForm onCreated={load} />
        )}

        <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Scheduled</th>
              <th align="left">Attachment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {exams.map(e => (
              <tr key={e.id} style={{ borderTop: '1px solid #ddd' }}>
                <td>{e.title}</td>
                <td>{e.scheduled_at ? new Date(e.scheduled_at).toLocaleString() : '-'}</td>
                <td>
                  {e.attachment_path ? (
                    <button onClick={() => downloadFile(e.attachment_path)}>Download</button>
                  ) : '-'}
                </td>
                <td>
                  {(auth?.user.role === 'ADMIN') && (
                    <button onClick={() => remove(e.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}