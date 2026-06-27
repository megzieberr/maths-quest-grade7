/* Die ingetekende leerder se gebruikersnaam + wagwoord (in localStorage). */
const KEY = "g7.session";
export function getSession() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
export function setSession(username, password) { localStorage.setItem(KEY, JSON.stringify({ username, password })); }
export function clearSession() { localStorage.removeItem(KEY); }
export function isLoggedIn() { return !!getSession(); }
