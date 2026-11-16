import React, { useEffect } from 'react';

// Куда ведёт «Я выбираю создавать» на финале.
export const LINK_AFTER = 'https://go.junior-it.uz/login';

// Слайд задаёт главную кнопку низа: { label, ok, onNext, skip }.
export function useNav(setNav, deps, make) {
  useEffect(() => { setNav(make()); }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

// Заголовок слайда: ярлык шага, заголовок, подзаголовок.
export const Head = ({ eyebrow, title, sub }) => (
  <div className="sl-head">
    <span className="chip">{eyebrow}</span>
    <h1>{title}</h1>
    {sub ? <p className="sl-sub">{sub}</p> : null}
  </div>
);

// Строка задания — белая карточка с оранжевой полосой слева (как в наших уроках).
export const Task = ({ children, right }) => (
  <div className="task"><span className="task-t">{children}</span>{right ? <span className="task-r">{right}</span> : null}</div>
);
