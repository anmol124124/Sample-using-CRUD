const KEY = 'auth';

export function setAuth(token, user) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

export function getAuth() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}