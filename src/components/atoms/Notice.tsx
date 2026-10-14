import type { ReactNode } from 'react';

export interface NoticeProps { tone?: 'neutral' | 'weak' | 'warn' | 'danger' | 'success'; children: ReactNode }

export function Notice({ tone = 'neutral', children }: NoticeProps) {
  return <p className={`notice notice--${tone}`}>{children}</p>;
}
