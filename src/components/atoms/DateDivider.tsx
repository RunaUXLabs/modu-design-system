import type { ReactNode } from 'react';

export interface DateDividerProps { children: ReactNode }
export function DateDivider({ children }: DateDividerProps) {
  return <div className="chat__date">{children}</div>;
}
