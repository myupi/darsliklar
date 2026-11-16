// Иллюстрации пробного урока — единый список слотов (для кода и для агента, который их генерирует).
// Файл кладётся в src/img/<id>.webp (или .png / .jpg). Пока файла нет, слот показывает прежний значок.
//
// kind — как картинка стоит на странице, отсюда и фон при генерации:
//   tile     — квадрат «на весь кадр» со своим фоном (CSS обрезает углы); прозрачность не нужна;
//   portrait — квадрат-портрет со своим фоном, показывается в круге (лицо — в центре верхней половины);
//   cover    — широкая обложка «на весь кадр» со своим фоном;
//   onwhite  — предмет на чисто белом фоне #FFFFFF: на светлой карточке белое растворяется (mix-blend-mode: multiply).
// from: 'junior' — картинка взята с сайта Junior IT (junior-12-yosh.vercel.app/images/, заказчик, 16.11.2026):
//   её не генерировать заново; from: 'svg' — нарисована в SVG вручную в стиле обложек Junior IT (16.11.2026).
//   Остальные сгенерированы Gemini по prompt + STYLE.
// asis — картинка показывается целиком как есть (свой фон и скругление уже в файле).
// size — во что сохранить (пиксели). Генерировать можно крупнее, потом уменьшить; файл — не больше ~250 КБ.

// Общий стиль — ко всем промптам (образец стиля: src/img/_ref/style-boy.webp).
export const STYLE = 'Modern 2D cartoon illustration, like a high-quality animated series: clean bold dark outlines, '
  + 'cel shading with soft gradients, warm cinematic light with an orange (#FA4F28) rim light, friendly expressive faces, '
  + 'Central Asian (Uzbek) people, modern casual clothes. Bright, optimistic, for kids 8–17. '
  + 'No text, no letters, no numbers, no logos, no brand marks, no watermark.';

export const ART = {
  // ── Слайд 1. Возраст ──
  'age-kids': { kind: 'tile', size: [512, 512], slide: 1, where: 'Карточка «Kids 8–10 лет»',
    prompt: 'A cheerful 9-year-old boy holding a game controller, colorful puzzle-like coding blocks floating around him, small rocket and stars. Square composition, character centered, background: soft violet gradient (#9B7BFF to #7C5CFA).' },
  'age-teens': { kind: 'tile', size: [512, 512], slide: 1, where: 'Карточка «Teens 11–17 лет»',
    prompt: 'A confident 14-year-old teenager (girl or boy) with a laptop showing abstract colorful code lines, a small robot and a website window floating nearby. Square composition, character centered, background: warm orange gradient (#FF8A5C to #FA4F28).' },

  // ── Слайд 2. Приложения (без логотипов брендов!) ──
  'app-roblox': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «Roblox»',
    prompt: 'App-icon style illustration: a small blocky 3D game world on a floating island with a tiny blocky character. Generic, NOT the Roblox logo. Background: solid soft red (#FFE3E1).' },
  'app-minecraft': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «Minecraft»',
    prompt: 'App-icon style illustration: a single cube of pixel grass-and-dirt block with a tiny pickaxe. Generic voxel block, NOT the Minecraft logo. Background: solid soft green (#E3F2D6).' },
  'app-football': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «Футбол-симулятор»',
    prompt: 'App-icon style illustration: a soccer ball flying into a goal net with motion lines and a glowing trajectory arc (physics). Background: solid soft blue (#DCEBFF).' },
  'app-youtube': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «YouTube»',
    prompt: 'App-icon style illustration: a rounded video screen with a big play triangle and small floating thumbnails. Generic, NOT the YouTube logo. Background: solid soft red (#FFE0E3).' },
  'app-tiktok': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «TikTok»',
    prompt: 'App-icon style illustration: a smartphone showing a vertical short-video feed, music notes and hearts floating up. Generic, NOT the TikTok logo. Background: solid dark navy (#1E1B39).' },
  'app-instagram': { kind: 'tile', size: [256, 256], slide: 2, from: 'junior', where: 'Карточка «Instagram»',
    prompt: 'App-icon style illustration: a retro photo camera with a pink-orange-purple gradient body and floating photo cards. Generic, NOT the Instagram logo. Background: solid soft pink (#FCE4F1).' },

  // ── Слайд 3. Команда ──
  mentor: { kind: 'portrait', size: [512, 512], slide: 3, where: 'Круг «Твой ментор»',
    prompt: 'Head-and-shoulders portrait of a friendly young male IT mentor (about 25), smiling, wearing a headset with a microphone and an orange hoodie, laptop edge visible. Face in the center of the upper half (it is cropped to a circle). Background: soft warm orange gradient (#FFD9C8 to #FFB49A).' },
  curator: { kind: 'portrait', size: [512, 512], slide: 3, where: 'Круг «Твой куратор»',
    prompt: 'Head-and-shoulders portrait of a friendly young woman curator (about 25), smiling, holding a tablet with a calendar, teal top, headset. Face in the center of the upper half (it is cropped to a circle). Background: soft teal gradient (#CFF5EE to #9BE3D6).' },

  // ── Слайд 4. Платформа: обложки курсов ──
  'course-kids': { kind: 'cover', size: [640, 400], slide: 4, from: 'svg', where: 'Курс «Kids» (главная и вкладка «Курсы»)',
    prompt: 'Wide banner: a cute small robot astronaut flying between four colorful planets (computer planet, cartoon-game planet, code-blocks planet, trophy planet) in a friendly space. Background: deep violet space with stars.' },
  'course-web': { kind: 'cover', size: [640, 400], slide: 4, from: 'svg', where: 'Курс «Веб-программирование»',
    prompt: 'Wide banner: a teenager building a website — a big browser window being assembled from layers: a skeleton frame, colorful clothes-like styles, and a glowing brain chip (HTML, CSS, JS as metaphors, without letters). Background: warm orange-peach gradient.' },
  'course-math': { kind: 'cover', size: [640, 400], slide: 4, from: 'junior', where: 'Курс «Математика»',
    prompt: 'Wide banner: playful geometry — a triangle, cube, ruler, compass and a friendly calculator character, sequence of growing glowing dots. Background: soft teal gradient.' },
  'course-eng': { kind: 'cover', size: [640, 400], slide: 4, from: 'junior', where: 'Курс «IT English»',
    prompt: 'Wide banner: a teenager with headphones talking to friends on a laptop video call around a glowing globe, speech bubbles with simple icons (no letters). Background: warm yellow-amber gradient.' },

  // ── Слайд 4. CoinShop: подарки — фото техники на серых плитках с сайта Junior IT ──
  'gift-vr': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «VR-очки»', prompt: '' },
  'gift-phone': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Смартфон»', prompt: '' },
  'gift-laptop': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Ноутбук»', prompt: '' },
  'gift-ultrabook': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Ультрабук»', prompt: '' },
  'gift-tablet': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Планшет»', prompt: '' },
  'gift-speaker': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Умная колонка»', prompt: '' },
  'gift-headphones': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Наушники»', prompt: '' },
  'gift-keyboard': { kind: 'asis', size: [240, 240], slide: 4, from: 'junior', where: 'CoinShop «Игровой набор»', prompt: '' },

  // ── Слайд 5. Веб-студия: герои турнира — с сайта Junior IT ──
  'hero-steve': { kind: 'tile', size: [256, 256], slide: 5, from: 'junior', where: 'Веб-студия: «Стив — шахтёр»', prompt: '' },
  'hero-roblox': { kind: 'tile', size: [256, 256], slide: 5, from: 'junior', where: 'Веб-студия: «Роблоксиан — паркур-мастер»', prompt: '' },
  'hero-ender': { kind: 'tile', size: [256, 256], slide: 5, from: 'junior', where: 'Веб-студия: «Эндер — телепортация»', prompt: '' },

  // ── Слайд 5. Лабиринт (на белом: клетки поля светлые) ──
  'maze-robot': { kind: 'onwhite', size: [256, 256], slide: 5, where: 'Лабиринт: робот, которого ведёт ученик', prompt: 'A cute small wheeled robot with big friendly eyes and an orange (#FA4F28) antenna light, front view, whole body visible. Pure white background (#FFFFFF), no shadow.' },
  'maze-portal': { kind: 'onwhite', size: [256, 256], slide: 5, where: 'Лабиринт: портал-финиш', prompt: 'A glowing swirling violet magic portal ring, front view. Pure white background (#FFFFFF), no shadow.' },

  // ── Слайд 6. Финал ──
  'final-consume': { kind: 'cover', size: [800, 500], slide: 6, where: 'Карточка «Потреблять»', prompt: 'Wide scene: a tired teenager sitting on a bed late at night endlessly scrolling a glowing phone, cold blue light, floating notification bubbles and likes around (no text). Mood: passive, a bit sad.' },
  'final-create': { kind: 'cover', size: [800, 500], slide: 6, where: 'Карточка «Создавать»', prompt: 'Wide scene: an excited teenager at a desk building their own website and game on a laptop and a second monitor, warm daylight from a window, a small robot helper, sticky notes with sketches (no text). Mood: proud, creative.' },
};

// Порядок генерации: сначала то, что видно сразу.
export const PRIORITY = [
  ['1 — главное', ['age-kids', 'age-teens', 'mentor', 'curator', 'final-consume', 'final-create', 'maze-robot', 'maze-portal']],
  ['2 — приложения и курсы', ['app-roblox', 'app-minecraft', 'app-football', 'app-youtube', 'app-tiktok', 'app-instagram', 'course-kids', 'course-web', 'course-math', 'course-eng']],
  ['3 — подарки и герои (с сайта Junior IT)', ['gift-vr', 'gift-phone', 'gift-laptop', 'gift-ultrabook', 'gift-tablet', 'gift-speaker', 'gift-headphones', 'gift-keyboard', 'hero-steve', 'hero-roblox', 'hero-ender']],
];
