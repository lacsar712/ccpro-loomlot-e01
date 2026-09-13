import { writable } from 'svelte/store';

const TOKEN_KEY = 'loomlot_token';
const USER_KEY = 'loomlot_user';

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export const token = writable(localStorage.getItem(TOKEN_KEY) || '');
export const user = writable(loadUser());

export function setSession(accessToken, userInfo) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  token.set(accessToken);
  user.set(userInfo);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  token.set('');
  user.set(null);
}
