import type { ReactNode } from 'react';

export interface ChipProps { tone?: 'neutral' | 'primary' | 'danger' | 'success' | 'warn'; children: ReactNode }

export function Chip({ tone = 'neutral', children }: ChipProps) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}
