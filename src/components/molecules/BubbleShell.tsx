import type { ReactNode } from 'react';

export interface BubbleShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function BubbleShell({ title, subtitle, children }: BubbleShellProps) {
  return (
    <div className="bubble">
      <div className="bubble__head">
        <span className="bubble__app">모두의 시간</span>
        <span className="bubble__title">{title}</span>
        {subtitle && <span className="bubble__subtitle">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}
