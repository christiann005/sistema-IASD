const TOKEN_KEY = 'iglesia_token';
const USER_KEY = 'iglesia_user';

export type StoredUser = {
  sub: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
};

export function saveSession(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
}
