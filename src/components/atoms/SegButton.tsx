import type { KeyboardEvent } from 'react';
import type { ResponseValue } from '../../types.js';

export interface SegButtonProps {
  value?: ResponseValue;
  onChange: (value: ResponseValue) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function SegButton({ value, onChange, disabled = false, 'aria-label': label = '참석 가능 여부' }: SegButtonProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: ResponseValue) {
    if (disabled) return;
    let next: ResponseValue;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      next = current === 'ok' ? 'hard' : 'ok';
    } else if (event.key === 'Home') next = 'ok';
    else if (event.key === 'End') next = 'hard';
    else return;
    event.preventDefault();
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button');
    buttons?.[next === 'ok' ? 0 : 1].focus();
    onChange(next);
  }
  return <div className={`seg ${disabled ? 'seg--disabled' : ''}`} role="radiogroup" aria-label={label} aria-disabled={disabled}>
    {(['ok', 'hard'] as const).map((response) => <button key={response} type="button" role="radio"
      aria-checked={value === response} disabled={disabled}
      tabIndex={value === response || (!value && response === 'ok') ? 0 : -1}
      className={`seg__item ${value === response ? `seg__item--${response}` : ''}`}
      onKeyDown={(event) => handleKeyDown(event, response)} onClick={() => onChange(response)}>
      {response === 'ok' ? '가능' : '어려움'}
    </button>)}
  </div>;
}
