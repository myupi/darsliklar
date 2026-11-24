import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import ttsService from './tools/vite-tts-service.mjs';
import lessonTitles from './tools/vite-lesson-titles.mjs';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // ttsService — сервис озвучки для уроков, которые говорят по ttsApiBase.
  // lessonTitles — названия уроков на трёх языках из META уроков (шапка просмотрщика).
  plugins: [react(), ttsService(), lessonTitles()],
  resolve: {
    // Уроки импортируют платформу как '@lesson/runtime'. В просмотрщике её
    // заменяет локальная эмуляция из src/runtime.
    alias: { '@lesson/runtime': r('./src/runtime/index.js') },
  },
  server: { port: 5173 },
  build: {
    // Файлы уроков большие (до 600 КБ) — это нормально, не предупреждаем.
    chunkSizeWarningLimit: 4000,
    // Память сборки (24.11.2026): уроков 300+, исходников ~175 МБ — сборка на Rollup не помещалась в память контейнера Vercel
    // (OOM, SIGKILL). Сборщик — rolldown-vite (тот же Vite, ядро на Rust); размер в gzip для отчёта не считаем.
    reportCompressedSize: false,
    sourcemap: false,
    rollupOptions: {
      // demo-mir — проба «живого мира» урока 17 (заказчик открывает её на Vercel по тому же пути).
      input: { main: r('./index.html'), player: r('./player.html'), trainer: r('./trainer.html'), 'demo-mir': r('./tools/problemitas17/demo/mir.html'),
        'demo-zhivoy': r('./tools/problemitas17/demo/zhivoy.html') },
    },
  },
});
