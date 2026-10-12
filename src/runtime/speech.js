// Голос просмотрщика. На платформе реплики читает сервер озвучки; здесь —
// голос браузера (speechSynthesis) или тихая пауза той же длины.

import { config } from './bridge.js';

// Маркер языка в начале реплики: «[Русское произношение] …», «[O'zbekcha tallaffuz] …»,
// «[English pronunciation] …». Платформа по нему выбирает язык голоса.
const MARKERS = [
  [/рус/i, 'ru'],
  [/zbek/i, 'uz'],
  [/english/i, 'en'],
];

export function parseLine(raw) {
  let text = String(raw == null ? '' : raw);
  let lang = null;
  let marker = null;
  const m = text.match(/^\s*\[([^\]]+)\]\s*/);
  if (m) {
    for (const [re, l] of MARKERS) if (re.test(m[1])) { lang = l; break; }
    if (lang) { marker = m[1]; text = text.slice(m[0].length); }
  }
  // Прочие теги в квадратных скобках ([laughs] и т.п.) браузерному голосу не нужны.
  const spoken = text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
  return { text, spoken, lang: lang || config.lang || 'ru', marker };
}

export const estimateMs = (s) => Math.max(900, Math.min(20000, String(s || '').length * 62));

// Узбекского голоса в браузерах почти нет. Турецкий читает узбекскую латиницу
// заметно ближе к правде, чем русский, поэтому он — первый запасной.
const BCP = {
  ru: ['ru-RU', 'ru'],
  uz: ['uz-UZ', 'uz', 'tr-TR', 'tr', 'ru-RU'],
  en: ['en-US', 'en-GB', 'en'],
};

export const speechAvailable = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

function pickVoice(lang) {
  if (!speechAvailable()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  for (const code of BCP[lang] || BCP.ru) {
    const want = code.toLowerCase();
    const v = voices.find((x) => String(x.lang || '').toLowerCase().replace('_', '-').startsWith(want));
    if (v) return v;
  }
  return null;
}

// Голоса в Chrome подгружаются асинхронно — прогреваем список заранее.
if (speechAvailable()) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
  } catch (e) { /* no-op */ }
}

// Резолвится строкой-причиной: 'end' | 'cancel' | 'timeout' | 'error:<код>'.
export function speakBrowser(line, voiceName) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const u = new window.SpeechSynthesisUtterance(line.spoken);
    const v = pickVoice(line.lang);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = (BCP[line.lang] || BCP.ru)[0];
    u.rate = 0.95;
    u.pitch = voiceName === 'kids-m' ? 0.95 : voiceName === 'kids-f' ? 1.2 : 1.05;
    let done = false;
    const finish = (why) => {
      if (done) return;
      done = true;
      clearTimeout(safety);
      resolve(why);
    };
    u.onend = () => finish('end');
    u.onerror = (e) => {
      const code = (e && e.error) || 'unknown';
      finish(code === 'interrupted' || code === 'canceled' ? 'cancel' : 'error:' + code);
    };
    // Страховка: некоторые голоса не присылают onend на длинных фразах.
    const safety = setTimeout(() => finish('timeout'), estimateMs(line.spoken) * 2 + 4000);
    try { synth.speak(u); } catch (e) { finish('error:speak'); }
  });
}

export function cancelBrowser() {
  if (speechAvailable()) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
  }
}
