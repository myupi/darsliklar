// Связь плеера (iframe) с окном просмотрщика.
// Всё, что урок делает с платформой (реплики, звуки, события, финиш, ошибки),
// уходит в журнал просмотрщика через postMessage.

export const MSG_SOURCE = 'darsliklar-player';

const inFrame = typeof window !== 'undefined' && window.parent && window.parent !== window;

export function emit(type, data) {
  if (inFrame) {
    try {
      window.parent.postMessage({ source: MSG_SOURCE, type, data, t: Date.now() }, window.location.origin);
    } catch (e) {
      // payload с функциями или циклическими ссылками не клонируется — шлём строкой
      try {
        window.parent.postMessage({ source: MSG_SOURCE, type, data: String(data), t: Date.now() }, window.location.origin);
      } catch (e2) { /* no-op */ }
    }
  }
  if (type === 'error') console.error('[lesson]', data);
}

// Настройки эмуляции. Плеер выставляет их до монтирования урока.
export const config = {
  voice: 'browser', // 'browser' — голос браузера · 'simulate' — тишина с паузой по длине фразы · 'fast' — тишина, паузы вшестеро короче · 'off' — голоса нет совсем
  lang: 'ru',       // язык урока: им читаются реплики без маркера языка
  assets: {},       // манифест ассетов урока для useAssets().resolveUrl
};

export function configureRuntime(patch) {
  Object.assign(config, patch || {});
}
