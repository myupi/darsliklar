// Настройки просмотрщика: живут в адресе страницы (можно поделиться ссылкой)
// и в localStorage (переживают перезапуск).

const KEY = 'darsliklar:viewer';

export const DEFAULTS = {
  lesson: '',
  lang: 'ru',
  name: '',
  device: 'phone',
  rotated: false,
  voice: 'browser',
  start: '',
  logOpen: true,
  view: 'lessons',   // 'lessons' | 'compiler' — режим просмотрщика: уроки или задания для компилятора
  cmp: '',           // выбранное задание компилятора: '<модуль>:<номер>'
  quizBar: true, // тесты: полоса платформы с «Tekshirish» (эмуляция платформы в плеере)
};

const URL_KEYS = ['lesson', 'lang', 'device', 'voice', 'start', 'name', 'view', 'cmp'];

export function readPrefs() {
  let saved = {};
  try { saved = JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
  const q = new URLSearchParams(window.location.search);
  const fromUrl = {};
  URL_KEYS.forEach((k) => { if (q.has(k)) fromUrl[k] = q.get(k); });
  if (q.has('rotated')) fromUrl.rotated = q.get('rotated') === '1';
  return Object.assign({}, DEFAULTS, saved, fromUrl);
}

export function writePrefs(p) {
  try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* no-op */ }
  const q = new URLSearchParams();
  if (p.lesson) q.set('lesson', p.lesson);
  q.set('lang', p.lang);
  q.set('device', p.device);
  if (p.rotated) q.set('rotated', '1');
  q.set('voice', p.voice);
  if (p.name) q.set('name', p.name);
  if (p.start !== '') q.set('start', p.start);
  if (p.view === 'compiler') q.set('view', 'compiler');
  if (p.view === 'compiler' && p.cmp) q.set('cmp', p.cmp);
  const next = '?' + q.toString();
  if (next !== window.location.search) window.history.replaceState(null, '', next);
}
