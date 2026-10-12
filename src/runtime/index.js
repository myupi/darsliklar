// Эмуляция '@lesson/runtime' — того, что платформа даёт уроку.
// Уроки импортируют её так же, как на проде:
//   import { useAudio, useSfx, useAssets } from '@lesson/runtime';
//
// useAudio(segments) → { isPlaying, muted, pushOneOff(text, voice?), triggerEvent(type, target?),
//                        replay(), toggleMute(), stop() }
//   segments: [{ id, text, trigger: 'on_mount' | 'after_previous', waits_for?: { type, target? } }]
//   Сегменты звучат по очереди; сегмент с waits_for после реплики ждёт triggerEvent(type, target).
// useSfx()   → { playCorrect(), playWrong(), playClick(), play(name) }
// useAssets() → { resolveUrl(key) } — ссылка из манифеста урока или null.
//
// Правило: если урок не работает здесь — чинится урок, а не эта эмуляция.
// Сюда добавляется только то, что действительно умеет платформа.

import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import * as engine from './engine.js';
import { config, emit } from './bridge.js';
import { SFX } from './sfx.js';

export { configureRuntime } from './bridge.js';

const segKey = (list) =>
  (Array.isArray(list) ? list : [])
    .filter(Boolean)
    .map((s) => (s.id || '') + '|' + (s.text || '') + '|' + (s.waits_for ? s.waits_for.type + ':' + (s.waits_for.target || '') : ''))
    .join('¶');

const matches = (wf, type, target) =>
  wf && wf.type === type && (wf.target == null || target == null || wf.target === target);

function createRunner(list) {
  let alive = true;
  let waiter = null;
  const owner = {};

  async function start() {
    for (const seg of list) {
      if (!alive) return;
      await engine.whenIdle(); // реплика pushOneOff договаривается, сегмент её не перебивает
      if (!alive) return;
      const wf = seg.waits_for && seg.waits_for.type ? seg.waits_for : null;
      let early = false;
      // событие может прийти, пока реплика ещё звучит, — оно засчитывается
      waiter = wf ? { wf, hit: () => { early = true; } } : null;
      await engine.play(seg.text, { voice: seg.voice, kind: 'segment', id: seg.id, owner });
      if (!alive) return;
      if (wf && !early) {
        emit('wait', { id: seg.id || null, waits_for: wf });
        await new Promise((res) => { waiter = { wf, hit: res }; });
      }
      waiter = null;
    }
  }

  return {
    start,
    event(type, target) {
      if (waiter && matches(waiter.wf, type, target)) waiter.hit();
    },
    dispose() {
      alive = false;
      if (waiter) waiter.hit();
      engine.stopOwner(owner);
    },
  };
}

export function useAudio(segments) {
  const snap = useSyncExternalStore(engine.subscribe, engine.getState, engine.getState);
  const runner = useRef(null);
  const key = segKey(segments);
  const segRef = useRef(segments);
  segRef.current = segments;

  useEffect(() => {
    const list = (Array.isArray(segRef.current) ? segRef.current : []).filter((s) => s && s.text);
    if (!list.length) return undefined;
    const r = createRunner(list);
    runner.current = r;
    r.start();
    return () => {
      r.dispose();
      if (runner.current === r) runner.current = null;
    };
  }, [key]);

  const api = useMemo(() => ({
    pushOneOff: (text, voice) => { engine.oneOff(text, voice); },
    triggerEvent: (type, target) => {
      emit('event', { type, target: target == null ? null : target });
      if (runner.current) runner.current.event(type, target);
    },
    replay: () => engine.replay(),
    toggleMute: () => engine.toggleMute(),
    stop: () => engine.stop(),
  }), []);

  return useMemo(
    () => Object.assign({}, api, { isPlaying: snap.isPlaying, muted: snap.muted, playing: snap.isPlaying }),
    [api, snap.isPlaying, snap.muted]
  );
}

export function useSfx() {
  return SFX;
}

export function useAssets() {
  return useMemo(() => ({
    assets: config.assets,
    resolveUrl: (key) => (config.assets && config.assets[key]) || null,
  }), []);
}
