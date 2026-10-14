import type { MouseEventHandler, ReactNode } from 'react';
import { NameFlow } from './NameFlow.js';

export interface BoardProps {
  waiting: readonly string[];
  suffix: ReactNode;
  deadline: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function Board({ waiting, suffix, deadline, onClick }: BoardProps) {
  return <button type="button" className="board" onClick={onClick}>
    <NameFlow ids={waiting} suffix={suffix} /><span className="board__deadline">{deadline}</span>
  </button>;
}
