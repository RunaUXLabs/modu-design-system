import { MatrixCell } from '../atoms/MatrixCell.js';
import { MatrixRow } from './MatrixRow.js';
import type { MatrixResponses, MatrixSlot } from './MatrixRow.js';

export interface MatrixTableProps {
  slots: readonly MatrixSlot[];
  memberIds: readonly string[];
  responses?: Readonly<Record<string, MatrixResponses | undefined>>;
  requiredIds?: readonly string[];
  outMembers?: readonly string[];
}

export function MatrixTable({
  slots,
  memberIds,
  responses = {},
  requiredIds,
  outMembers = [],
}: MatrixTableProps) {
  return (
    <div className="matrix matrix--table">
      <div className="matrix__row matrix__row--head">
        <span className="matrix__name matrix__name--head">팀원 · 필/선</span>
        {slots.map((slot) => (
          <MatrixCell key={slot.id} state="head">
            {slot.day.slice(0, 1)} {slot.time.slice(0, 5)}
          </MatrixCell>
        ))}
      </div>
      {memberIds.map((id) => (
        <MatrixRow
          key={id}
          id={id}
          slots={slots}
          responses={responses[id]}
          required={requiredIds === undefined ? undefined : requiredIds.includes(id)}
          absent={outMembers.includes(id)}
        />
      ))}
    </div>
  );
}
