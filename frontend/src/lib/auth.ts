export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

const AUTH_USER_KEY = 'naoolift_user_session';

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(AUTH_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  // Admin login check
  const isAdmin = email.toLowerCase() === 'admin@naoo.app' || email.toLowerCase().includes('admin');
  
  const user: UserProfile = {
    id: isAdmin ? 'usr-admin-01' : `usr-${Date.now()}`,
    name: isAdmin ? 'Admin Naoo' : email.split('@')[0].toUpperCase(),
    email: email,
    role: isAdmin ? 'admin' : 'user',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  return { success: true, user };
}

export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
  if (!name || !email || !password) {
    return { success: false, message: 'Semua kolom data wajib diisi.' };
  }

  const user: UserProfile = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: 'user',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  return { success: true };
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '/login';
  }
}
