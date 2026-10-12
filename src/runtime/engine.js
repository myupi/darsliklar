// Единый «раннер» озвучки, как на платформе: в каждый момент звучит одна реплика.
// Новая реплика обрывает текущую. Состояние (isPlaying, muted) общее для всех
// useAudio() урока.

import { config, emit } from './bridge.js';
import { parseLine, estimateMs, speakBrowser, cancelBrowser, speechAvailable } from './speech.js';

let state = { isPlaying: false, muted: false };
const listeners = new Set();

function setState(patch) {
  state = Object.assign({}, state, patch);
  listeners.forEach((f) => f());
}

export const subscribe = (f) => { listeners.add(f); return () => listeners.delete(f); };
export const getState = () => state;

let current = null;   // { seq, owner, cancel }
let seq = 0;
let lastLine = null;  // { raw, voice } — для replay()
let idleWaiters = [];
let warnedBlocked = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function settleIdle() {
  const w = idleWaiters;
  idleWaiters = [];
  w.forEach((f) => f());
}

export function whenIdle() {
  return current ? new Promise((r) => idleWaiters.push(r)) : Promise.resolve();
}

// Сыграть реплику. Резолвится, когда она отзвучала или её оборвали.
export function play(raw, { voice, kind = 'line', id, owner } = {}) {
  const line = parseLine(raw);
  if (!line.spoken) return Promise.resolve('empty');
  stopCurrent();
  lastLine = { raw, voice };

  emit('tts', {
    text: String(raw), spoken: line.spoken, lang: line.lang, marker: line.marker,
    voice: voice || null, kind, id: id || null, muted: state.muted, mode: config.voice,
  });

  // Голоса нет совсем: isPlaying так и не поднимется — урок должен это пережить.
  if (state.muted || config.voice === 'off') return Promise.resolve('silent');

  const my = ++seq;
  let cancelNow;
  const cancelled = new Promise((r) => { cancelNow = () => r('cancel'); });
  const useBrowser = config.voice === 'browser' && speechAvailable();

  const sounding = (async () => {
    if (useBrowser) {
      const why = await speakBrowser(line, voice);
      if (why === 'error:not-allowed') {
        // Браузер не даёт говорить до первого касания внутри урока.
        if (!warnedBlocked) {
          warnedBlocked = true;
          emit('warn', 'Браузер заблокировал голос до первого клика внутри урока — до этого реплики идут тихой паузой.');
        }
        return sleep(estimateMs(line.spoken)).then(() => 'end');
      }
      return why;
    }
    // 'fast' — та же тишина, но вшестеро короче: для прогона урока на стенде.
    const ms = config.voice === 'fast' ? Math.max(350, estimateMs(line.spoken) / 6) : estimateMs(line.spoken);
    return sleep(ms).then(() => 'end');
  })();

  current = {
    seq: my,
    owner: owner || null,
    cancel: () => { cancelNow(); if (useBrowser) cancelBrowser(); },
  };
  setState({ isPlaying: true });

  return Promise.race([sounding, cancelled]).then((why) => {
    if (current && current.seq === my) {
      current = null;
      setState({ isPlaying: false });
      settleIdle();
    }
    return why;
  });
}

function stopCurrent() {
  if (!current) return;
  const c = current;
  current = null;
  c.cancel();
  setState({ isPlaying: false });
  settleIdle();
}

export function stop() { stopCurrent(); }

export function stopOwner(owner) {
  if (current && owner && current.owner === owner) stopCurrent();
}

export function oneOff(text, voice) {
  return play(text, { voice, kind: 'oneOff' });
}

export function replay() {
  if (lastLine) play(lastLine.raw, { voice: lastLine.voice, kind: 'replay' });
}

export function toggleMute() {
  const muted = !state.muted;
  if (muted) stopCurrent();
  setState({ muted });
  emit('info', muted ? 'Урок выключил звук (toggleMute)' : 'Урок включил звук (toggleMute)');
}
