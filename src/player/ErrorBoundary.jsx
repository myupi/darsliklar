import React from 'react';
import { reportError } from './report.js';

// Падение урока не должно оставлять белый экран: показываем ошибку и стек.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, stack: '' };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    const stack = (info && info.componentStack) || '';
    this.setState({ stack });
    reportError((error && error.message) || error, { stack: String((error && error.stack) || ''), componentStack: stack });
  }

  render() {
    const { error, stack } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={S.wrap}>
        <div style={S.card}>
          <div style={S.badge}>Урок упал</div>
          <h1 style={S.h1}>{String(error.message || error)}</h1>
          <p style={S.p}>Ошибка поймана просмотрщиком. Подробности — в журнале справа и в консоли браузера.</p>
          {stack ? <pre style={S.pre}>{stack.trim()}</pre> : null}
        </div>
      </div>
    );
  }
}

const S = {
  wrap: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box', background: '#FFF7F5', fontFamily: 'system-ui, -apple-system, sans-serif' },
  card: { maxWidth: 720, width: '100%', background: '#fff', border: '1px solid #F3C4B8', borderRadius: 14, padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,.06)' },
  badge: { display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#B42318', background: '#FEE4E2', borderRadius: 99, padding: '3px 10px', marginBottom: 12 },
  h1: { fontSize: 18, lineHeight: 1.35, margin: '0 0 8px', color: '#101828', wordBreak: 'break-word' },
  p: { fontSize: 14, color: '#475467', margin: '0 0 14px' },
  pre: { fontSize: 12, lineHeight: 1.5, background: '#F9FAFB', border: '1px solid #EAECF0', borderRadius: 8, padding: 12, maxHeight: 320, overflow: 'auto', margin: 0, color: '#344054' },
};
