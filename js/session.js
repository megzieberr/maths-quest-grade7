/* Die ingetekende leerder se gebruikersnaam + wagwoord (in localStorage).
   'n Onderwyser-voorskou (?preview=1) gebruik 'n IN-GEHEUE-ALLEEN sessie
   (setPreviewSession) sodat 'n voorskou-besoek nooit die regte g7.session-
   sleutel oorskryf, daaruit lees, of daarin skryf nie — sien PreviewBackend
   in js/api.js. */
const KEY = "g7.session";
let previewSession = null;
export function setPreviewSession(username, password) { previewSession = { username, password }; }
export function getSession() {
  if (previewSession) return previewSession;
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function setSession(username, password) { localStorage.setItem(KEY, JSON.stringify({ username, password })); }
export function clearSession() { localStorage.removeItem(KEY); }
export function isLoggedIn() { return !!getSession(); }
