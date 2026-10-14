import { useMember } from '../../members.js';
import type { Slot, ResponseValue } from '../../types.js';
import { Avatar } from '../atoms/Avatar.js';
import { MatrixCell } from '../atoms/MatrixCell.js';

export type MatrixSlot = Slot & { id: string };
export type MatrixResponses = Readonly<Record<string, ResponseValue | undefined>>;

export interface MatrixRowProps {
  id: string;
  slots: readonly MatrixSlot[];
  responses?: MatrixResponses;
  required?: boolean;
  absent?: boolean;
}

export function MatrixRow({ id, slots, responses = {}, required, absent = false }: MatrixRowProps) {
  const { member } = useMember(id);
  const req = required ?? member.required ?? false;

  return (
    <div className="matrix__row">
      <span className="matrix__name">
        <Avatar id={id} size="sm" />
        <span className="matrix__nametext">
          {member.name}
          <i className={`matrix__role ${req ? 'matrix__role--req' : ''}`}>{req ? '필' : '선'}</i>
        </span>
      </span>
      {slots.map((slot) => {
        const value = responses[slot.id];
        return (
          <MatrixCell key={slot.id} state={value ?? 'none'}>
            {value === 'ok' ? '✓' : value === 'hard' ? '✕' : absent ? '불참' : '–'}
          </MatrixCell>
        );
      })}
    </div>
  );
}
