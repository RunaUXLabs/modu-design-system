import type { MouseEventHandler, ReactNode } from 'react';

export interface FieldProps {
  label: string;
  value: ReactNode;
  source?: ReactNode;
  showSource?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  children?: ReactNode;
}

export function Field({ label, value, source, showSource = true, onClick, ariaLabel = label, children }: FieldProps) {
  return <div className="field">
    <div className="field__row"><span className="field__label">{label}</span>
      <button type="button" className="field__value" aria-label={ariaLabel} onClick={onClick}>
        {value} <em className="field__editicon" aria-hidden="true">✎</em>
      </button>
    </div>
    {showSource && source && <span className="field__source">{source}</span>}
    {children}
  </div>;
}
