import React, { useEffect, useState } from 'react';
import { getAuth, clearAuth } from '../auth';
import ProtectedRoute from './ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import ExamForm from './ExamForm';

const API = import.meta.env.VITE_API_URL || '';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [expandedExam, setExpandedExam] = useState(null);
  const auth = getAuth();
  const nav = useNavigate();

  async function load() {
    const res = await fetch(`${API}/api/exams`, { headers: { Authorization: `Bearer ${auth?.token || ''}` } });
    if (!res.ok) return;
    setExams(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    const res = await fetch(`${API}/api/exams/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${auth?.token || ''}` } });
    if (res.ok) {
      setExams(exams.filter(e => e.id !== id));
      if (editingExam?.id === id) setEditingExam(null);
    }
  }

  function startEdit(exam) {
    setEditingExam(exam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const canEdit = auth?.user.role === 'ADMIN' || auth?.user.role === 'TEACHER';
  const canDelete = auth?.user.role === 'ADMIN';

  return (
    <ProtectedRoute>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
        padding: '24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            background: 'white',
            padding: '20px 32px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{ margin: 0, color: '#667eea', fontSize: '32px' }}>
                📚 Exam Management System
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                Manage and track all your exams in one place
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: '#f8f9fa',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    {auth?.user.email}
                  </div>
                  <div style={{ fontSize: '12px', color: '#667eea', fontWeight: 'bold' }}>
                    {auth?.user.role}
                  </div>
                </div>
              </div>
              <button 
                onClick={logout}
                style={{
                  padding: '10px 20px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(220,53,69,0.3)'
                }}
                onMouseOver={e => e.target.style.background = '#c82333'}
                onMouseOut={e => e.target.style.background = '#dc3545'}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Form */}
          {canEdit && (
            <ExamForm 
              onCreated={() => { load(); setEditingExam(null); }} 
              editingExam={editingExam}
              onCancelEdit={() => setEditingExam(null)}
            />
          )}

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #667eea'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Exams</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{exams.length}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #28a745'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Upcoming</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                {exams.filter(e => e.scheduled_at && new Date(e.scheduled_at) > new Date()).length}
              </div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #ffc107'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>With Attachments</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
                {exams.filter(e => e.attachment_path).length}
              </div>
            </div>
          </div>

          {/* Exams List */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>📋 All Exams</h2>
            </div>

            {exams.length === 0 ? (
              <div style={{
                padding: '60px 24px',
                textAlign: 'center',
                color: '#999'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <div style={{ fontSize: '18px' }}>No exams yet. Create your first exam!</div>
              </div>
            ) : (
              <div style={{ padding: '16px' }}>
                {exams.map((e, index) => (
                  <div 
                    key={e.id} 
                    style={{
                      background: expandedExam === e.id ? '#f8f9fa' : 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '12px',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      boxShadow: expandedExam === e.id ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onClick={() => setExpandedExam(expandedExam === e.id ? null : e.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>📄</span>
                          <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>{e.title}</h3>
                          {editingExam?.id === e.id && (
                            <span style={{
                              background: '#667eea',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              ✏️ Editing
                            </span>
                          )}
                        </div>
                        
                        {expandedExam === e.id && e.description && (
                          <p style={{ margin: '12px 0', color: '#666', lineHeight: '1.6' }}>
                            {e.description}
                          </p>
                        )}
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
                          {e.scheduled_at && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                              <span>🗓️</span>
                              <span style={{ fontSize: '14px' }}>
                                {new Date(e.scheduled_at).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {e.attachment_path && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                              <span>📎</span>
                              <span style={{ fontSize: '14px' }}>Has attachment</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                        {e.attachment_path && (
                          <button
                            onClick={() => downloadFile(e.attachment_path)}
                            style={{
                              padding: '8px 16px',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseOver={e => e.target.style.background = '#218838'}
                            onMouseOut={e => e.target.style.background = '#28a745'}
                          >
                            📥 Download
                          </button>
                        )}
                        
                        {canEdit && (
                          <button
                            onClick={() => startEdit(e)}
                            style={{
                              padding: '8px 16px',
                              background: '#ffc107',
                              color: '#333',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseOver={e => e.target.style.background = '#e0a800'}
                            onMouseOut={e => e.target.style.background = '#ffc107'}
                          >
                            ✏️ Edit
                          </button>
                        )}
                        
                        {canDelete && (
                          <button
                            onClick={() => remove(e.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseOver={e => e.target.style.background = '#c82333'}
                            onMouseOut={e => e.target.style.background = '#dc3545'}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            padding: '20px',
            color: '#666',
            fontSize: '14px'
          }}>
            <p>Made with ❤️ using React & Sequelize ORM</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
