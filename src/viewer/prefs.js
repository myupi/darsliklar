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
  navHidden: false, // левая панель (каталог) скрыта — на широком экране
  barHidden: false, // верхняя панель урока (шапка) скрыта
  dualZoom: 100,    // два окна: масштаб ноутбука, % (как Ctrl + / − в браузере)
  dualPhone: '390x844',  // два окна: размер телефона ('WxH' или 'fit' — во всю высоту)
  dualLaptop: '1366x800', // два окна: размер ноутбука ('WxH' или 'fit' — всё остальное место, масштаб dualZoom)
  view: 'lessons',   // 'lessons' | 'compiler' | 'trainer' — режим просмотрщика: уроки, задания для компилятора, тренажёры
  trn: 'html',       // тренажёр: '<id>' — попытка, '<id>:bank' — все вопросы, '<id>:bank:<урок>' — вопросы урока
  trnQ: '',          // выбранный вопрос банка (question_id)
  trnMode: 'reward', // эмуляция LMS: reward | practice
  trnUpto: '',       // пройдено уроков: '' — весь модуль, '4' — уроки 1–4 (образец математики: блок b01…)
  trnN: '15',        // вопросов в попытке
  trnSave: 'ok',     // сохранение ответа: ok | slow | fail
  trnExit: true,     // LMS передаёт onExit
  trnRestart: true,  // LMS передаёт onRestart
  cmp: '',           // выбранное задание компилятора: '<модуль>:<номер>'
  quizBar: true, // тесты: полоса платформы с «Tekshirish» (эмуляция платформы в плеере)
};

const URL_KEYS = ['lesson', 'lang', 'device', 'voice', 'start', 'name', 'view', 'cmp', 'trn', 'trnQ'];

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
  if (p.view === 'trainer') { q.set('view', 'trainer'); if (p.trn) q.set('trn', p.trn); if (p.trnQ && /:bank/.test(p.trn || '')) q.set('trnQ', p.trnQ); }
  const next = '?' + q.toString();
  if (next !== window.location.search) window.history.replaceState(null, '', next);
}
