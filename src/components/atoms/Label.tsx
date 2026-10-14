import type { ReactNode } from 'react';

export interface LabelProps { children: ReactNode }
export function Label({ children }: LabelProps) {
  return <span className="judge__label">{children}</span>;
}
