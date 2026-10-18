// Самопроверка QA: сценарий, который на исправной фикстуре должен пройти.
export default {
  title: 'Фикстура: нажать «Готово» и получить одно завершение',
  adapter: 'basic',
  langs: ['ru'],
  size: '375x740',
  expectFinish: true,
  steps: [
    {
      name: 'Нажать «Готово»',
      shot: 'done',
      run: async (qa) => {
        qa.expect(qa.text('#msg') === 'Нажми кнопку', 'до нажатия — исходный текст');
        qa.click('#done', 'кнопка «Готово»');
        await qa.waitFor(() => qa.text('#msg') === 'Готово!', 3000, 'сообщение «Готово!»');
        // События плеера приходят асинхронно (postMessage) — ждём, а не проверяем мгновенно.
        await qa.waitFor(() => qa.finished().length >= 1, 3000, 'событие завершения');
        qa.expect(qa.finished().length >= 1, 'пришло событие завершения');
      },
    },
  ],
};
