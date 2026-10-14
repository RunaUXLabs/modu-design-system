/* ============================================================
   JudgeBar — 테스터 컨트롤 (제품 밖 레이어, 어두운 배경으로 분리)
   · 계정 전환: 6명 시점을 자유롭게 오간다 (상태는 전 계정 공유)
   · 시간 진행: 건드리지 않은 팀원만 기본 행동을 수행한다
   · 리셋: 처음부터 다시
   ============================================================ */
import React from 'react';
import { useStore, MEMBER_IDS } from '../scheduling/model/store.jsx';
import { STAGES } from '../scheduling/model/data.js';
import { Label, MemberCard, StageTrack } from '@design-system';

export default function JudgeBar() {
  const { state, dispatch } = useStore();
  const stage = STAGES[state.phase];
  const done = state.mode === 'confirmed';

  return (
    <div className="judge">
      <div className="judge__row">
        <Label>시점 전환</Label>
        <div className="judge__avatars">
          {MEMBER_IDS.map((id) => (
            <MemberCard
              key={id}
              id={id}
              active={state.currentUser === id}
              desc={(id === 'runa' ? '주최자' : state.required.includes(id) ? '필참' : '선택 참석') + (id === 'mara' ? ' · 수요일 외근' : '')}
              onClick={() => dispatch({ type: 'SWITCH_USER', id })}
            />
          ))}
        </div>
      </div>

      <div className="judge__row judge__row--time">
        <Label>시간 흐름</Label>
        <StageTrack phase={state.phase} />
        <button
          type="button"
          className="judge__advance"
          disabled={state.phase >= 3 || done}
          onClick={() => dispatch({ type: 'ADVANCE' })}
        >
          {done ? '확정 완료' : state.phase >= 3 ? '마감 이후' : '→ 다음 단계'}
        </button>
        <button type="button" className="judge__reset" onClick={() => dispatch({ type: 'RESET' })}>
          ↺ 리셋
        </button>
      </div>

      <div className="judge__desc">
        <b>{stage.title}</b><br />{done ? '회의가 확정됐어요. 리셋 후 다른 선택을 해보세요.' : stage.desc}
        <span className="judge__principle">직접 응답한 팀원은 각자의 기본 행동 대신 그 선택대로 움직여요.</span>
      </div>
    </div>
  );
}
