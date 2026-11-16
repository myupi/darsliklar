import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Пробный урок — свой проект: свой index.html, свой порт. Зависимости (react, vite) берутся из node_modules
// корня репозитория (поиск модулей идёт вверх по папкам); `npm install` здесь не обязателен.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  preview: { port: 5181 },
});
