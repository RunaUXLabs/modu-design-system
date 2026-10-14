/* ============================================================
   Scheduling Bubbles — 채팅방 안의 인터랙티브 메시지.
   하나의 버블이 상태에 따라 전환된다:
   잠정 확정 → (이의) 조율 모드 → 확정 요약 / 교집합 붕괴
   ============================================================ */
import React from 'react'
import { useStore, MEMBERS } from '../model/store.jsx'
import { waitingIds, rankedSlots, isResponded, isRequired } from '../model/store.jsx'
import { PROPOSAL_SLOT, MEMBER_IDS } from '../model/data.js'
import { SlotCard } from '@design-system'
import { Avatar, Button, Chip, NameFlow, Notice } from '@design-system'
import { BubbleShell, Board } from '@design-system'

/* ---------- S1. 생성 — 채팅방 안의 시작점 (주최자에게만 CTA) ---------- */
export function ComposeCard() {
  const { state, dispatch } = useStore()
  const isHost = state.currentUser === 'runa'
  if (!isHost) return null // 다른 팀원에겐 아직 아무것도 게시되지 않은 상태
  return (
    <BubbleShell title={`${state.meeting.title} · ${state.meeting.duration}`} subtitle="조건을 정하면 시스템이 시간을 찾아 잠정 확정해요">
      <Notice tone="neutral">
        팀원들의 캘린더와 회의룸 예약 상황을 읽어 모두가 비는 시간을 먼저 골라요. 투표는 필요할 때만 열려요.
      </Notice>
      <div className="bubble__actions">
        <Button variant="primary" full onClick={() => dispatch({ type: 'SHEET', open: true })}>
          회의 만들기
        </Button>
      </div>
    </BubbleShell>
  )
}

/* ---------- 계층 1: 잠정 확정 ---------- */
export function ProposalBubble() {
  const { state, dispatch } = useStore()
  const me = state.currentUser
  const mine = state.proposal[me]
  const waiting = waitingIds(state)
  const escalated = state.mode === 'proposalEscalated'
  const isHost = me === 'runa'

  return (
    <BubbleShell title={`${state.meeting.title} · ${state.meeting.duration}`} subtitle="캘린더와 회의룸이 모두 비는 시간으로 잡았어요">
      <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
      <Notice tone="weak">
        여섯 명의 캘린더와 회의룸이 모두 비는 시간 중 가장 이른 시간이에요. 캘린더에 없는 사정이 있다면 알려주세요.
      </Notice>
      <Notice tone="neutral">
        어려우면 <b>{state.meeting.deadline}</b>까지 알려주세요. 이의가 없으면 그대로 확정돼요.
      </Notice>

      {!isHost && (
        <div className="bubble__actions">
          {mine === 'ok' ? (
            <Chip tone="success">확인 완료 — 참석으로 정리됐어요</Chip>
          ) : (
            <>
              <Button variant="primary" size="md" full onClick={() => dispatch({ type: 'SHEET', open: true })}>
                {isRequired(state, me) ? '확인하기' : '응답하기'}
              </Button>
              {!isRequired(state, me) && (
                <Notice tone="weak">응답하지 않아도 괜찮아요 — 참석 가능한 것으로 정리돼요.</Notice>
              )}
            </>
          )}
        </div>
      )}

      {waiting.length > 0 && (
        <Board waiting={waiting} suffix="님의 확인이 꼭 필요해요"
          deadline="응답하지 않은 분들은 참석 가능한 것으로 정리돼요"
          onClick={() => dispatch({ type: 'SHEET', open: true })} />
      )}
      {escalated && isHost && (
        <Notice tone="warn">확인 기한이 지나 아직 확인하지 않은 필참자에게만 다시 알렸어요.</Notice>
      )}
    </BubbleShell>
  )
}

/* ---------- 계층 2: 조율 모드 ---------- */
export function CoordinationBubble() {
  const { state, dispatch } = useStore()
  const me = state.currentUser
  const isHost = me === 'runa'
  const ranked = rankedSlots(state)
  const bestId = ranked[0]?.reqOk || ranked[0]?.ok > 0 ? ranked[0].slot.id : null
  const waiting = waitingIds(state)
  const responded = isResponded(state, me)
  const afterDeadline = state.phase >= 3

  return (
    <BubbleShell
      title={`${state.meeting.title} · ${state.meeting.duration}`}
      subtitle={state.widened ? '기간을 넓혀 다시 조율하고 있어요' : '일정을 다시 조율하고 있어요'}
    >
      {isHost && state.objection && (
        <Notice tone="warn">
          비공개 이의 1건 — {MEMBERS[state.objection.member].name} · “{state.objection.reason}” (나에게만 보여요)
        </Notice>
      )}
      <div className="bubble__slots">
        {state.slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            variant="tally"
            okCount={ranked.find((r) => r.slot.id === slot.id)?.ok ?? 0}
            total={MEMBER_IDS.length}
            myValue={state.coord[me]?.[slot.id]}
            best={slot.id === bestId}
            onClick={() => dispatch({ type: 'SHEET', open: true })}
          />
        ))}
      </div>
      {!state.widened && (
        <Notice tone="weak">수요일은 팀원 일정으로, 화 13:00는 조율 요청으로 후보에서 제외했어요.</Notice>
      )}

      {!isHost && (
        <div className="bubble__actions">
          {responded ? (
            <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'SHEET', open: true })}>
              내 응답 수정하기
            </Button>
          ) : state.outMembers.includes(me) ? (
            <>
              <Chip tone="neutral">마감 규칙으로 불참 정리됨</Chip>
              <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'SHEET', open: true })}>
                지금 응답하고 참여하기
              </Button>
            </>
          ) : (
            <Button variant="primary" full onClick={() => dispatch({ type: 'SHEET', open: true })}>
              가능한 시간 응답하기
            </Button>
          )}
        </div>
      )}
      {isHost && (
        <div className="bubble__actions">
          <Button variant="secondary" full onClick={() => dispatch({ type: 'SHEET', open: true })}>
            응답 현황 보기
          </Button>
        </div>
      )}

      {waiting.length > 0 && (
        <Board waiting={waiting} suffix="님의 응답을 기다리고 있어요"
          deadline={afterDeadline ? '응답 마감이 지났어요' : `${state.meeting.deadline} 마감 · 마감 후 미응답 시 참석이 어려운 것으로 정리돼요`}
          onClick={() => dispatch({ type: 'SHEET', open: true })} />
      )}
      {state.outMembers.length > 0 && (
        <Notice tone="weak">
          <NameFlow ids={state.outMembers} suffix="님은 마감 규칙에 따라 불참으로 정리됐어요. 지금 응답하면 다시 참여할 수 있어요." />
        </Notice>
      )}
      {afterDeadline && state.escalated.length > 0 && isHost && (
        <Notice tone="danger">
          필참자 <NameFlow ids={state.escalated} suffix="님이 마감까지 응답하지 않았어요. 현황에서 처리해주세요." />
        </Notice>
      )}
    </BubbleShell>
  )
}

/* ---------- 확정 요약 (전원 통보) ---------- */
export function ConfirmedBubble() {
  const { state } = useStore()
  const { slot, via, absent, unconfirmedRequired } = state.confirmed
  const attendees = MEMBER_IDS.filter((id) => !absent.includes(id) && !unconfirmedRequired.includes(id))
  const reRequests = Object.keys(state.reRequested).length
  /* 조율 영수증 — 시스템이 주최자 대신 한 일의 가시화 (가치 교환표: 주최자가 '받는 것') */
  const receipt =
    via === 'layer1'
      ? '조율 영수증 — 단체방 독촉 0회, 투표 0회. 침묵이 그대로 확정이 됐어요.'
      : `조율 영수증 — 단체방 독촉 0회, 개인 리마인드 ${state.phase >= 2 ? 1 : 0}회, 재요청 ${reRequests}회`

  return (
    <BubbleShell title="회의가 확정됐어요" subtitle={via === 'layer1' ? '이의 없이 그대로 확정됐어요' : '조율 결과로 확정됐어요'}>
      <SlotCard slot={slot} variant="hero" />
      <div className="confirm__people">
        <span className="confirm__label">참석 {attendees.length}</span>
        <div className="confirm__avatars">
          {attendees.map((id) => (
            <Avatar key={id} id={id} size="sm" />
          ))}
        </div>
      </div>
      {absent.length > 0 && (
        <Notice tone="weak">
          마감 규칙에 따라 불참으로 정리됐어요: {absent.map((id) => MEMBERS[id].name).join(', ')}
        </Notice>
      )}
      {unconfirmedRequired.length > 0 && (
        <Notice tone="warn">
          {unconfirmedRequired.map((id) => MEMBERS[id].name).join(', ')}님은 아직 확인 전이에요 — 별도로 안내했어요.
        </Notice>
      )}
      <Notice tone="success">모두의 캘린더에 등록하고 {slot.room}을 예약했어요.</Notice>
      <Notice tone="weak">{receipt}</Notice>
    </BubbleShell>
  )
}

/* ---------- 교집합 붕괴: 설계된 실패 상태 ---------- */
export function NoSlotBubble() {
  const { state, dispatch } = useStore()
  const isHost = state.currentUser === 'runa'
  return (
    <BubbleShell title="다음 주엔 모두 가능한 시간이 없어요" subtitle="꼭 참석해야 하는 분들의 일정이 겹치지 않아요">
      {isHost ? (
        <div className="bubble__actions">
          <Button variant="primary" full onClick={() => dispatch({ type: 'WIDEN' })}>
            기간을 넓혀 다시 찾기
          </Button>
          <Notice tone="weak">또는 필참 구성을 조정해보세요 — 필참자가 적을수록 시간이 빨리 잡혀요.</Notice>
        </div>
      ) : (
        <Notice tone="neutral">루나님이 일정을 다시 조율하고 있어요.</Notice>
      )}
    </BubbleShell>
  )
}

export function SchedulingBubble() {
  const { state } = useStore()
  if (state.mode === 'compose') return <ComposeCard />
  if (state.mode === 'confirmed') return <ConfirmedBubble />
  if (state.mode === 'noslot') return <NoSlotBubble />
  if (state.mode === 'coordination') return <CoordinationBubble />
  return <ProposalBubble />
}
