import { api, setAuthToken, clearAuthToken } from '../services/api';
import { UserDataBundle } from '../types';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
}

const SESSION_KEY = 'edumitra_auth_session';

/**
 * Retrieve current active cached session if any
 */
export function getStoredSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') {
      return { id: parsed.id, name: parsed.name, email: parsed.email };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persist active session in cache
 */
export function setStoredSession(user: AuthUser): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to persist session:', err);
  }
}

/**
 * Clear active session and auth token
 */
export function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    clearAuthToken();
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

/**
 * Authenticate existing credentials against backend
 */
export async function authenticateUser(
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string; user?: AuthUser; userData?: UserDataBundle }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both your email and password.' };
  }

  try {
    const response = await api.login(cleanEmail, cleanPassword);
    setStoredSession(response.user);
    setAuthToken(response.token);
    return { 
      success: true, 
      user: response.user, 
      userData: response.userData 
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Incorrect email or password.' 
    };
  }
}

/**
 * Register a new user account against backend
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string; user?: AuthUser; userData?: UserDataBundle }> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const cleanConfirm = confirmPassword.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  if (cleanPassword !== cleanConfirm) {
    return { success: false, error: 'Passwords do not match.' };
  }

  try {
    const response = await api.register(cleanName, cleanEmail, cleanPassword, cleanConfirm);
    setStoredSession(response.user);
    setAuthToken(response.token);
    return { 
      success: true, 
      user: response.user, 
      userData: response.userData 
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Registration failed. Please try again.' 
    };
  }
}
