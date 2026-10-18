// Headless Chrome и минимальный клиент Chrome DevTools Protocol — без зависимостей.
//
// Происхождение: поиск Chrome, ожидание порта DevTools и обмен сообщениями CDP
// адаптированы из ~/.claude/skills/anatomy/scripts/drive.mjs и chrome-port.mjs
// (навык anatomy пользователя). Скопировано 18.10.2026 для QA команды уроков.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

export function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  for (const base of [join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright')]) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base).sort().reverse()) {
      for (const sub of ['chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux64/chrome', 'chrome-linux/chrome']) {
        candidates.push(join(base, dir, sub));
      }
    }
  }
  return candidates.find((p) => existsSync(p)) || null;
}

function waitPort(chrome) {
  return new Promise((done, fail) => {
    let text = '';
    const timer = setTimeout(() => fail(new Error('Chrome не запустился за 20 с')), 20000);
    chrome.stderr.on('data', (chunk) => {
      text += chunk;
      const m = text.match(/DevTools listening on ws:\/\/[^:]+:(\d+)\//);
      if (m) { clearTimeout(timer); done(Number(m[1])); }
    });
    chrome.on('error', (e) => { clearTimeout(timer); fail(e); });
    chrome.on('exit', (code, sig) => { clearTimeout(timer); fail(new Error('Chrome завершился при старте: ' + (code ?? sig))); });
  });
}

// autoplay: true — звук разрешён без касания (как у ученика, который уже нажал на урок);
// звук при этом выключен (--mute-audio).
export async function launchChrome({ autoplay = true } = {}) {
  const binary = chromePath();
  if (!binary) {
    const e = new Error('Chrome не найден. Укажи путь в переменной CHROME_PATH.');
    e.blocked = true;
    throw e;
  }
  const profile = mkdtempSync(join(tmpdir(), 'lesson-team-qa-'));
  const args = ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
    ...(autoplay ? ['--autoplay-policy=no-user-gesture-required'] : []),
    ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'];
  const chrome = spawn(binary, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let port;
  try {
    port = await waitPort(chrome);
  } catch (e) {
    chrome.kill('SIGKILL');
    rmSync(profile, { recursive: true, force: true });
    e.blocked = true;
    throw e;
  }
  let version = null;
  try { version = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).Browser; } catch { /* no-op */ }
  return {
    port, binary, version,
    close() {
      chrome.kill('SIGKILL');
      try { rmSync(profile, { recursive: true, force: true }); } catch { /* no-op */ }
    },
  };
}

// Новая вкладка и сессия CDP: send / on / evaluate / screenshot.
export async function openPage(port) {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = () => fail(new Error('CDP: нет соединения с вкладкой')); });
  let seq = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (msg) => {
    const d = JSON.parse(msg.data);
    if (d.id && pending.has(d.id)) {
      const p = pending.get(d.id);
      pending.delete(d.id);
      clearTimeout(p.timer);
      if (d.error) p.fail(new Error(d.error.message)); else p.ok(d.result || {});
    } else if (d.method) {
      (listeners.get(d.method) || []).forEach((fn) => fn(d.params || {}));
    }
  };
  const send = (method, params = {}, timeout = 30000) => new Promise((ok, fail) => {
    const id = ++seq;
    const timer = setTimeout(() => {
      pending.delete(id);
      const e = new Error(`CDP: тайм-аут ${method} (${timeout} мс)`);
      e.timeout = true;
      fail(e);
    }, timeout);
    pending.set(id, { ok, fail, timer });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const on = (method, fn) => {
    if (!listeners.has(method)) listeners.set(method, []);
    listeners.get(method).push(fn);
  };
  const once = (method, timeout) => new Promise((ok, fail) => {
    const timer = setTimeout(() => fail(new Error(`CDP: не дождались ${method}`)), timeout);
    const fn = (p) => {
      clearTimeout(timer);
      listeners.set(method, (listeners.get(method) || []).filter((f) => f !== fn));
      ok(p);
    };
    on(method, fn);
  });
  // Выполнить выражение в верхнем окне (страница-обвязка) и дождаться промиса.
  const evaluate = async (expression, timeout = 60000) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, timeout);
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error((d.exception && (d.exception.description || d.exception.value)) || d.text || 'ошибка выполнения');
    }
    return r.result ? r.result.value : undefined;
  };
  const screenshot = async () => (await send('Page.captureScreenshot', { format: 'png' })).data;
  return { send, on, once, evaluate, screenshot, close: () => ws.close() };
}
