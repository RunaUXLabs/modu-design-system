import type { MouseEventHandler } from 'react';
import { useMember } from '../../members.js';
import { Avatar } from '../atoms/Avatar.js';

export interface MemberCardProps {
  id: string;
  active?: boolean;
  desc?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function MemberCard({ id, active = false, desc, onClick }: MemberCardProps) {
  const { member } = useMember(id);
  const role = desc ?? member.desc;

  return (
    <button
      type="button"
      className={`judge__member ${active ? 'judge__member--active' : ''}`}
      onClick={onClick}
    >
      <Avatar id={id} size="md" />
      <span className="judge__membername">{member.name}</span>
      {role && <span className="judge__memberdesc">{role}</span>}
    </button>
  );
}
