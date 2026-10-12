import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Скопировать' }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1200);
    } catch (e) { /* буфер недоступен — молча */ }
  };
  return (
    <button type="button" className="icon-btn sm" onClick={copy} title={label} aria-label={label}>
      {ok ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
