import { Fragment, type ReactNode } from 'react';
import { useMember } from '../../members.js';

export interface NameFlowProps { ids: readonly string[]; suffix: ReactNode }

function MemberName({ id }: { id: string }) {
  const { member } = useMember(id);
  return <b>{member.name}</b>;
}

export function NameFlow({ ids, suffix }: NameFlowProps) {
  if (!ids.length) return null;
  return <span className="nameflow">{ids.map((id, index) => <Fragment key={id}>
    <MemberName id={id} />{index < ids.length - 1 ? ', ' : ''}
  </Fragment>)}{suffix}</span>;
}
