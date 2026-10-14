import type { ReactNode } from 'react';
import { useMember } from '../../members.js';
import { Avatar } from '../atoms/Avatar.js';
import { MessageBubble } from '../atoms/MessageBubble.js';

export interface MessageRowProps {
  from: string;
  me: string;
  children: ReactNode;
}

export function MessageRow({ from, me, children }: MessageRowProps) {
  const { member } = useMember(from);
  const mine = from === me;

  return (
    <div className={`chat__msg ${mine ? 'chat__msg--mine' : ''}`}>
      {!mine && <Avatar id={from} size="sm" />}
      <div className="chat__msgbody">
        {!mine && <span className="chat__name">{member.name}</span>}
        <MessageBubble type={mine ? 'mine' : 'incoming'}>{children}</MessageBubble>
      </div>
    </div>
  );
}
