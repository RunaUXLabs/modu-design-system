import type { CSSProperties } from 'react';
import { useMember } from '../../members.js';

export interface AvatarProps { id: string; size?: 'md' | 'sm'; dimmed?: boolean }

export function Avatar({ id, size = 'md', dimmed = false }: AvatarProps) {
  const { member, index } = useMember(id);
  return <span className={`avatar avatar--${size} ${dimmed ? 'avatar--dimmed' : ''}`}
    style={{ '--avatar-bg': `var(--user-${index % 6 + 1})` } as CSSProperties}
    aria-label={member.name}>{member.name[0]}</span>;
}
