import type { ReactNode } from 'react';

export interface MessageBubbleProps { type?: 'incoming' | 'mine'; children: ReactNode }

export function MessageBubble({ type = 'incoming', children }: MessageBubbleProps) {
  return <div className={`chat__text ${type === 'mine' ? 'chat__text--mine' : ''}`}>{children}</div>;
}
