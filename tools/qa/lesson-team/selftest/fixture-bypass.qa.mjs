// Самопроверка QA: сценарий, который пытается создать завершение в обход заданий.
// Раннер должен отказаться его выполнять (blocked), а не засчитать прохождение.
export default {
  title: 'Фикстура: попытка обхода',
  adapter: 'basic',
  langs: ['ru'],
  steps: [
    {
      name: 'Сообщить о завершении напрямую',
      run: async (qa) => { qa.win().parent.postMessage({ source: 'darsliklar-player', type: 'finished', data: {} }, '*'); },
    },
  ],
};
