import type { ReactNode } from 'react';

export interface StagePillProps { state?: 'default' | 'past' | 'now'; children: ReactNode }

export function StagePill({ state = 'default', children }: StagePillProps) {
  return <span className={`judge__stage ${state === 'default' ? '' : `judge__stage--${state}`}`}>{children}</span>;
}
