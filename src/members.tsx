import { createContext, useContext, type ReactNode } from 'react';
import type { Member } from './types.js';

const MembersContext = createContext<Readonly<Record<string, Member>> | null>(null);

export interface MembersProviderProps {
  members: Readonly<Record<string, Member>>;
  children: ReactNode;
}

export function MembersProvider({ members, children }: MembersProviderProps) {
  return <MembersContext.Provider value={members}>{children}</MembersContext.Provider>;
}

export function useMember(id: string) {
  const members = useContext(MembersContext);
  if (!members) throw new Error('Member components require MembersProvider.');
  if (!Object.prototype.hasOwnProperty.call(members, id)) {
    throw new Error(`Unknown member id: ${id}`);
  }
  return { member: members[id], index: Object.keys(members).indexOf(id) };
}
