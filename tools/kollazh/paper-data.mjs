// Звук бумаги для урока «Бумажная страница» → kollazh-paper-data.jsx (base64, урок самодостаточен).
// Источник: https://cdn.pixabay.com/audio/2022/04/16/audio_2eb630c66f.mp3 (Pixabay, свободная лицензия).
// assets/paper.mp3 — моно 32 кГц 48 кбит/с, громче на 9 дБ:
//   ffmpeg -i audio_2eb630c66f.mp3 -ac 1 -ar 32000 -af "highpass=f=120,volume=9dB,alimiter=limit=0.6:level=false" -b:a 48k assets/paper.mp3
// Запуск: node tools/kollazh/paper-data.mjs, потом сборка урока.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const b64 = readFileSync(resolve(dir, 'assets/paper.mp3')).toString('base64');
writeFileSync(resolve(dir, 'kollazh-paper-data.jsx'),
  '// Сгенерировано tools/kollazh/paper-data.mjs из assets/paper.mp3 — не править руками.\nconst PAPER_MP3 = \'' + b64 + '\';\n');
console.log('kollazh-paper-data.jsx', b64.length, 'символов');
