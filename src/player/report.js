import { emit } from '../runtime/bridge.js';

// React в режиме разработки сообщает об одной ошибке несколько раз
// (window.onerror + ErrorBoundary). В журнал уходит одна запись.
let last = { key: '', t: 0 };

export function reportError(message, extra) {
  const msg = String(message || 'error').replace(/^Uncaught\s+/, '').replace(/^(\w*Error):\s+/, '');
  const now = Date.now();
  if (last.key === msg && now - last.t < 1500) return;
  last = { key: msg, t: now };
  emit('error', Object.assign({ message: msg }, extra || {}));
}
