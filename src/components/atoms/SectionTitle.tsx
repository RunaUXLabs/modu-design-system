import type { ReactNode } from 'react';

export interface SectionTitleProps { children: ReactNode }
export function SectionTitle({ children }: SectionTitleProps) {
  return <div className="sheet__sectiontitle">{children}</div>;
}
