// ЭМУЛЯЦИЯ ПЛАТФОРМЫ для тестов (вид «тест», файлы NNtK-*.jsx; 13.11.2026).
// На платформе тест — один вопрос в формате CRM «JSX savol / test»: кнопку «Tekshirish» внизу держит платформа,
// тест получает { lang, mode, initialAnswer, onReady, registerCheck, onSubmit } и своей кнопки не рисует.
// Здесь — то же: полоса снизу с «Tekshirish» (открыта, когда тест сказал onReady(true)), после проверки — «Keyingisi».
// «Keyingisi» отдаёт результат вопроса в журнал как завершение (onFinished плеера) — ровно один раз.
import React, { useCallback, useRef, useState } from 'react';

const UI = {
  uz: { check: 'Tekshirish', next: 'Keyingisi' },
  ru: { check: 'Проверить', next: 'Дальше' },
  en: { check: 'Check', next: 'Next' },
};

// bar = false (просмотрщик: «Кнопка платформы — Нет», ?bar=0) — тест как есть, без полосы.
export default function QuizShell({ Lesson, lang, onFinished, bar = true }) {
  const U = UI[lang] || UI.uz;
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const checkRef = useRef(null);
  const done = useRef(false);
  const registerCheck = useCallback((f) => { checkRef.current = f; }, []);
  const onReady = useCallback((v) => setReady(!!v), []);
  const onSubmit = useCallback((p) => setResult(p || {}), []);
  const next = () => {
    if (done.current || !result) return;
    done.current = true;
    onFinished({ correct: !!result.correct, questionText: result.questionText, studentAnswer: result.studentAnswer, correctAnswer: result.correctAnswer, meta: result.meta, test: { score: result.correct ? 1 : 0, max: 1 } });
  };
  const btn = { minHeight: 46, padding: '0 26px', border: 0, borderRadius: 12, font: 'inherit', fontSize: 16, fontWeight: 700, color: '#fff', cursor: 'pointer' };
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, "Segoe UI", Roboto, system-ui, sans-serif' }}>
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', background: '#F4F5F7', '--aq-h': '100%' }}>
        <Lesson lang={lang} mode="answer" onReady={onReady} registerCheck={registerCheck} onSubmit={onSubmit} />
      </div>
      {bar ? <div className="quiz-shell-bar" style={{ flex: 'none', background: '#fff', borderTop: '1px solid #DCE3EE' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 760, margin: '0 auto', padding: '12px 16px' }}>
          {result
            ? <button type="button" className="quiz-shell-next" onClick={next} style={{ ...btn, background: result.correct ? '#4CAF6A' : '#C62828', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.16)' }}>{U.next}</button>
            : <button type="button" className="quiz-shell-check" disabled={!ready} onClick={() => checkRef.current && checkRef.current()}
              style={ready ? { ...btn, background: '#FA4F28', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.18)' } : { ...btn, background: '#E9E7EF', color: '#A6A2B8', cursor: 'default' }}>{U.check}</button>}
        </div>
      </div> : null}
    </div>
  );
}
