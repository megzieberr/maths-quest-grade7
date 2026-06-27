/* Tiny DOM + random helpers shared across the app. */
export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
export function mount(parent, ...kids) { kids.forEach(k => k && parent.appendChild(k)); return parent; }

/* Fisher–Yates shuffle (returns a new array). */
export function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
