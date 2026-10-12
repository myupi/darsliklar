// Короткие звуки платформы (верно / неверно / клик) — синтез WebAudio, без файлов.

import { emit } from './bridge.js';
import { getState } from './engine.js';

let ctx = null;

function audioCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// notes: [[частота Гц, начало с, длительность с]]
function tones(notes, type = 'sine', gain = 0.12) {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime + 0.01;
  notes.forEach(([f, at, dur]) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0 + at);
    g.gain.exponentialRampToValueAtTime(gain, t0 + at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
    o.connect(g).connect(c.destination);
    o.start(t0 + at);
    o.stop(t0 + at + dur + 0.05);
  });
}

const BANK = {
  correct: () => tones([[659, 0, 0.12], [880, 0.1, 0.22]], 'triangle'),
  wrong: () => tones([[220, 0, 0.16], [185, 0.12, 0.24]], 'sawtooth', 0.06),
  click: () => tones([[1200, 0, 0.04]], 'square', 0.04),
};

function play(name) {
  emit('sfx', name);
  if (getState().muted) return;
  try { (BANK[name] || BANK.click)(); } catch (e) { /* no-op */ }
}

export const SFX = Object.freeze({
  playCorrect: () => play('correct'),
  playWrong: () => play('wrong'),
  playClick: () => play('click'),
  play,
});
