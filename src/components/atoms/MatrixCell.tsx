import type { ReactNode } from 'react';

export type MatrixCellState = 'head' | 'ok' | 'hard' | 'none';
export interface MatrixCellProps { state: MatrixCellState; children: ReactNode }
export function MatrixCell({ state, children }: MatrixCellProps) {
  return <span className={`matrix__cell matrix__cell--${state}`}>{children}</span>;
}
