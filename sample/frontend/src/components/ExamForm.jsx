import React, { useState, useEffect } from 'react';
import { getAuth } from '../auth';

const API = import.meta.env.VITE_API_URL || '';

export default function ExamForm({ onCreated, editingExam, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    if (editingExam) {
      setTitle(editingExam.title || '');
      setDescription(editingExam.description || '');
      if (editingExam.scheduled_at) {
        const date = new Date(editingExam.scheduled_at);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setScheduledAt(localDateTime);
      }
    } else {
      resetForm();
    }
  }, [editingExam]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setScheduledAt('');
    setFile(null);
    setError(null);
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (description) fd.append('description', description);
      if (scheduledAt) fd.append('scheduled_at', new Date(scheduledAt).toISOString());
      if (file) fd.append('attachment', file);

      const url = editingExam 
        ? `${API}/api/exams/${editingExam.id}`
        : `${API}/api/exams`;
      
      const method = editingExam ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
        body: fd
      });
      
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      
      onCreated();
      resetForm();
      if (onCancelEdit) onCancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ color: 'white', marginTop: 0, marginBottom: '16px' }}>
        {editingExam ? '✏️ Edit Exam' : '➕ Create New Exam'}
      </h3>
      
      <form onSubmit={submit} style={{ display: 'grid', gap: '12px' }}>
        <input 
          placeholder="Exam Title *" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        
        <textarea 
          placeholder="Description (optional)" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          rows="3"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        
        <input 
          type="datetime-local" 
          value={scheduledAt} 
          onChange={e => setScheduledAt(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        
        <div style={{
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <label style={{ fontSize: '14px', color: '#666', flex: 1 }}>
            📎 Attachment (optional)
          </label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            style={{ fontSize: '14px' }}
          />
        </div>
        
        {error && (
          <div style={{ 
            color: 'white', 
            background: 'rgba(255,0,0,0.3)', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: loading ? '#ccc' : 'white',
              color: loading ? '#666' : '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {loading ? '⏳ Saving...' : (editingExam ? '💾 Update Exam' : '✨ Create Exam')}
          </button>
          
          {editingExam && (
            <button 
              type="button"
              onClick={handleCancel}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}