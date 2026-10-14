/* ============================================================
   ChatRoom — 사내 메신저의 팀 채팅방 (현재 계정 시점).
   공간은 하나: 요청·현황·확정이 모두 이 방의 버블 안에서 일어난다.
   푸시(배너)는 '나와 관련 있을 때만' 뜬다.
   ============================================================ */
import React from 'react';
import { useStore, MEMBERS } from '../../features/scheduling/model/store.jsx';
import { isResponded, isRequired } from '../../features/scheduling/model/store.jsx';
import { INTRO_MESSAGES, TRAILING_MESSAGES, TODAY_LABEL, HINTS, COMPOSE_HINT } from '../../features/scheduling/model/data.js';
import { SchedulingBubble } from '../../features/scheduling/components/bubbles.jsx';
import { IconBack, IconSettings, IconSend, IconPin } from '@design-system';
import Sheet from '../../features/scheduling/components/Sheet.jsx';
import { MessageRow, DateDivider } from '@design-system';

/* 타겟 푸시 계산 — 응답을 마친 사람에게는 아무것도 가지 않는다 */
function bannerFor(state) {
  const me = state.currentUser;
  const my = MEMBERS[me];
  if (state.mode === 'confirmed' || state.mode === 'compose') return null;

  if (state.mode === 'proposalEscalated' && isRequired(state, me) && me !== 'runa' && !state.proposal[me]) {
    return { text: `다음 주 회의 확정에 ${my.name}님 확인만 남았어요`, cta: '확인하기' };
  }
  if ((state.mode === 'coordination' || state.mode === 'noslot') && me !== 'runa') {
    if (state.reRequested[me] && !isResponded(state, me)) {
      /* 집행 명의의 원칙: 독촉의 주어는 주최자가 아니라 시스템 */
      return { text: `다음 주 회의 확정에 ${my.name}님 응답만 남았어요`, cta: '바로 응답' };
    }
    if (state.phase === 2 && !isResponded(state, me) && !state.outMembers.includes(me)) {
      return { text: `오늘 18:00 마감 — 다음 주 회의 시간 응답이 아직이에요`, cta: '응답하기' };
    }
  }
  if (me === 'runa') {
    if (state.mode === 'noslot') return { text: '모두 가능한 시간이 없어요 — 조건을 조정해보세요', cta: '보기' };
    if (state.phase >= 3 && state.escalated.length > 0) {
      const names = state.escalated.map((id) => MEMBERS[id].name).join(', ');
      return { text: `필참자 ${names}님이 마감까지 응답하지 않았어요`, cta: '처리하기' };
    }
    if (state.mode === 'coordination' && state.phase <= 1 && state.objection) {
      return { text: '비공개 이의가 도착해 일정을 다시 조율해요', cta: '현황 보기' };
    }
  }
  return null;
}

export default function ChatRoom() {
  const { state, dispatch } = useStore();
  const banner = bannerFor(state);
  const composing = state.mode === 'compose';
  const hint = state.hintOn && state.mode !== 'confirmed' ? (composing ? COMPOSE_HINT : HINTS[state.phase]) : null;

  return (
    <div className="phone">
      <div className="phone__notch" />
      <header className="chat__header">
        <IconBack />
        <div className="chat__title">
          <b>우리팀</b> <span className="chat__count">6</span>
        </div>
        <button type="button" className="chat__settings" aria-label="채팅방 설정">
          <IconSettings />
        </button>
      </header>

      {banner && (
        <button type="button" className="push" onClick={() => dispatch({ type: 'SHEET', open: true })}>
          <span className="push__app">모두의 시간</span>
          <span className="push__text">{banner.text}</span>
          <span className="push__cta">{banner.cta}</span>
        </button>
      )}

      {/* 확정 전까지 버블을 상단에 고정 — 제안이 대화에 밀려 올라가 침묵을 낳는 문제 차단 */}
      {!composing && state.mode !== 'confirmed' && (
        <button
          type="button"
          className="pinbar"
          onClick={() => document.getElementById('scheduling-bubble')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          <IconPin />
          <span className="pinbar__text">
            {state.meeting.title} — {state.mode === 'coordination' || state.mode === 'noslot' ? '조율 중' : '확인 대기'}
          </span>
          <span className="pinbar__cta">보기</span>
        </button>
      )}

      <main className="chat__scroll">
        <DateDivider>{TODAY_LABEL}</DateDivider>
        {INTRO_MESSAGES.map((m, i) => (
          <MessageRow key={i} from={m.from} me={state.currentUser}>
            {m.text}
          </MessageRow>
        ))}
        {composing ? (
          state.currentUser === 'runa' && (
            /* 생성 전: 주최자에게만 보이는 시작 카드 (아직 채팅방에 게시되지 않음) */
            <div className="chat__msg--center">
              <SchedulingBubble />
            </div>
          )
        ) : (
          <>
            {/* 집행 명의의 원칙: 버블은 루나의 말풍선이 아니라 시스템 명의의 중앙 카드 */}
            <div className="chat__msg--center" id="scheduling-bubble">
              <SchedulingBubble />
            </div>
            {TRAILING_MESSAGES.map((m, i) => (
              <MessageRow key={`t${i}`} from={m.from} me={state.currentUser}>
                {m.text}
              </MessageRow>
            ))}
          </>
        )}
      </main>

      {hint && (
        <div className="hintbar">
          <span>
            <em className="hintbar__badge">TIP</em> {hint}
          </span>
          <button type="button" onClick={() => dispatch({ type: 'TOGGLE_HINT' })}>
            숨기기
          </button>
        </div>
      )}

      <footer className="chat__input">
        <span>메시지 보내기…</span>
        <IconSend />
      </footer>

      <Sheet />
    </div>
  );
}
