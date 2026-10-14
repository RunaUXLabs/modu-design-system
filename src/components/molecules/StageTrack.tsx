import { StagePill } from '../atoms/StagePill.js';

export interface StageTrackProps {
  phase: 0 | 1 | 2 | 3;
}

const STAGES = ['T0', 'T1', 'T2', 'T3'] as const;

export function StageTrack({ phase }: StageTrackProps) {
  return (
    <div className="judge__stages">
      {STAGES.map((label, index) => (
        <StagePill key={label} state={index === phase ? 'now' : index < phase ? 'past' : 'default'}>
          {label}
        </StagePill>
      ))}
    </div>
  );
}
