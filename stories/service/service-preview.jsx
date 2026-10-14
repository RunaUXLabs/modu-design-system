import React, { useLayoutEffect, useRef, useState } from 'react';
import { StoreProvider, useStore, MEMBER_IDS } from '@modu-service/features/scheduling/model/store.jsx';
import { MEMBERS, COORD_SLOTS } from '@modu-service/features/scheduling/model/data.js';
import ChatRoom from '@modu-service/pages/components/ChatRoom.jsx';
import JudgeBar from '@modu-service/features/simulation/JudgeBar.jsx';
import Sheet from '@modu-service/features/scheduling/components/Sheet.jsx';
import { SchedulingBubble } from '@modu-service/features/scheduling/components/bubbles.jsx';
import { MembersProvider } from '@design-system';
import 'virtual:modu-service.css';
import './service-preview.css';

const create = { type: 'CREATE', required: ['dan', 'mara'] };
const coordinate = [create, { type: 'PROPOSAL_RESPOND', member: 'bibi', kind: 'objection', reason: '점심 직후는 어려워요' }];
const switchTo = (id) => ({ type: 'SWITCH_USER', id });
const open = { type: 'SHEET', open: true };
const deadline = [...coordinate, { type: 'ADVANCE' }, { type: 'ADVANCE' }];

// Seed by dispatching real service actions, never by duplicating its reducer or UI.
export const scenarios = {
  compose: [],
  composeSheet: [open],
  proposalRequired: [create, switchTo('dan')],
  proposalOptional: [create, switchTo('william')],
  coordination: coordinate,
  responsePreset: [...coordinate, switchTo('dan'), open],
  responseEdit: [...coordinate, switchTo('jessie'), open],
  organizer: [...deadline, open],
  confirmed: [create, ...MEMBER_IDS.filter((id) => id !== 'runa').map((member) => ({ type: 'PROPOSAL_RESPOND', member, kind: 'ok' }))],
  noSlot: [...coordinate, { type: 'COORD_RESPOND', member: 'dan', responses: Object.fromEntries(COORD_SLOTS.map((slot) => [slot.id, 'hard'])) }],
};

function Seed({ scenario, view }) {
  const { dispatch } = useStore();
  const started = useRef(false);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    if (started.current) return;
    started.current = true;
    for (const action of scenarios[scenario]) dispatch(action);
    setReady(true);
  }, [scenario, dispatch]);
  if (!ready) return null;
  if (view === 'bubble') return <div className="phone sb-pattern-phone">
    <div className="sb-pattern-content"><SchedulingBubble /></div><Sheet />
  </div>;
  return <div className="sb-service-layout">
    {view === 'workbench' && <aside className="sb-service-judge"><JudgeBar /></aside>}
    <ChatRoom />
  </div>;
}

export function ServicePreview({ scenario = 'compose', view = 'screen' }) {
  return <div className="sb-service-root">
    <StoreProvider key={`${scenario}:${view}`}>
      <MembersProvider members={MEMBERS}><Seed scenario={scenario} view={view} /></MembersProvider>
    </StoreProvider>
  </div>;
}
