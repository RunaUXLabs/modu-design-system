/* ============================================================
   BottomSheet — 현황판/버블 탭 시 열리는 개별 화면.
   같은 진입점, 보는 사람에 따라 3가지 상태:
   · 미응답자  → 응답 입력 (캘린더 제안 프리셋 + 확인)
   · 응답 완료 → 내 응답 확인·수정 (유동적 양보의 통로)
   · 주최자    → 현황 매트릭스 + 재요청/확정/마감 연장
   ============================================================ */
import React, { useState } from 'react'
import { useStore, MEMBERS, MEMBER_IDS } from '../model/store.jsx'
import { rankedSlots, isResponded, isRequired } from '../model/store.jsx'
import { PROPOSAL_SLOT, CALENDAR_PRESET, MEETING_FIELDS, REQUIRED_SOURCE } from '../model/data.js'
import { SlotCard } from '@design-system'
import { Avatar, Button, Chip, Notice } from '@design-system'
import { MatrixTable, SectionTitle, Field } from '@design-system'

const OBJECTION_REASONS = ['점심 직후는 어려워요', '외근이 있어요', '개인 일정이 있어요']

export default function Sheet() {
  const { state, dispatch } = useStore()
  if (!state.sheetOpen) return null
  const isHost = state.currentUser === 'runa'
  return (
    <div className="sheet__dim" onClick={() => dispatch({ type: 'SHEET', open: false })}>
      <div className={`sheet ${state.mode === 'compose' ? 'sheet--tall' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        {/* 각 시트가 본문(sheet__body)과 필요 시 하단 고정 푸터를 직접 구성 — 레이아웃 일관성 */}
        {state.mode === 'compose' ? (
          <ComposeSheet />
        ) : isHost ? (
          <OrganizerSheet />
        ) : state.mode === 'proposal' || state.mode === 'proposalEscalated' ? (
          <ProposalSheet />
        ) : (
          <ResponseSheet />
        )}
      </div>
    </div>
  )
}

/* ---------- S1. 생성 — 시스템이 미리 채운 값 + 출처, 탭해서 수정 ---------- */
function ComposeSheet() {
  const { state, dispatch } = useStore()
  const [req, setReq] = useState(() => state.required.filter((id) => id !== 'runa'))
  const [editing, setEditing] = useState(null) // 현재 수정 중인 필드 key
  const toggle = (id) => setReq((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const patch = (key, value) => {
    dispatch({ type: 'UPDATE_MEETING', patch: { [key]: value } })
    setEditing(null)
  }

  return (
    <>
      <div className="sheet__body">
      <div className="sheet__section">
        <h3 className="sheet__title">회의 만들기</h3>
        <Notice tone="neutral">
          채팅방 대화와 팀 캘린더를 읽고 미리 채워뒀어요. <b>값을 누르면 바꿀 수 있어요.</b>
        </Notice>
      </div>

      <div className="sheet__section">
        <SectionTitle>회의 정보</SectionTitle>
        <div className="compose__fields">
        {MEETING_FIELDS.map((f) => (
          <Field key={f.key} label={f.label} value={state.meeting[f.key]} source={f.source}
            ariaLabel={`${f.label}: ${state.meeting[f.key]}`}
            onClick={() => setEditing(editing === f.key ? null : f.key)}>
            {editing === f.key &&
              (f.type === 'text' ? (
                <input
                  className="field__input"
                  autoFocus
                  defaultValue={state.meeting[f.key]}
                  onKeyDown={(e) => e.key === 'Enter' && patch(f.key, e.target.value || state.meeting[f.key])}
                  onBlur={(e) => patch(f.key, e.target.value || state.meeting[f.key])}
                />
              ) : (
                <div className="field__options">
                  {f.options.map((opt) => (
                    <Button
                      key={opt}
                      variant={state.meeting[f.key] === opt ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => patch(f.key, opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              ))}
          </Field>
        ))}
        </div>
      </div>

      <div className="sheet__section">
        <SectionTitle>참석자와 필참</SectionTitle>
        <Notice tone="neutral">
          <b>“이 사람이 못 오면 회의를 다시 잡아야 하나요?”</b> — 그렇다면 필참으로 지정하세요.
        </Notice>
        <span className="field__source">{REQUIRED_SOURCE}</span>
        <div className="matrix">
        {MEMBER_IDS.filter((id) => id !== 'runa').map((id) => (
          <div className="matrix__row" key={id}>
            <span className="matrix__name">
              <Avatar id={id} size="sm" /> {MEMBERS[id].name}
            </span>
            <Button variant={req.includes(id) ? 'primary' : 'secondary'} size="sm" onClick={() => toggle(id)}>
              {req.includes(id) ? '필참' : '선택 참석'}
            </Button>
          </div>
        ))}
        </div>
        <Notice tone="weak">필참자가 적을수록 시간이 빨리 잡혀요 — 필참자 전원이 가능한 시간만 후보가 돼요.</Notice>
      </div>
      </div>

      {/* 하단 고정 푸터 — 위쪽 스크롤 포그로 본문 오버플로우를 암시 */}
      <div className="sheet__footer">
        <Button variant="primary" full onClick={() => dispatch({ type: 'CREATE', required: req })}>
          이 조건으로 시간 찾기
        </Button>
        <Notice tone="weak">필참/선택 구분은 나에게만 보여요. 팀원들에게는 같은 요청으로 전달돼요.</Notice>
      </div>
    </>
  )
}

/* ---------- 잠정 확정에 대한 개별 응답 ---------- */
function ProposalSheet() {
  const { state, dispatch } = useStore()
  const me = state.currentUser
  const [objecting, setObjecting] = useState(false)
  const required = isRequired(state, me)

  if (!objecting) {
    return (
      <div className="sheet__body">
        <h3 className="sheet__title">이 시간, 괜찮으세요?</h3>
        <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
        {required && <Notice tone="neutral">꼭 참석해야 하는 회의라 확인이 필요해요.</Notice>}
        <div className="sheet__actions">
          <Button variant="primary" full onClick={() => dispatch({ type: 'PROPOSAL_RESPOND', member: me, kind: 'ok' })}>
            괜찮아요
          </Button>
          <Button variant="secondary" full onClick={() => setObjecting(true)}>
            어려워요
          </Button>
        </div>
        <Notice tone="weak">‘어려워요’는 루나님에게만 전달돼요. 채팅방에는 표시되지 않아요.</Notice>
      </div>
    )
  }
  return (
    <div className="sheet__body">
      <h3 className="sheet__title">어떤 사정인지 알려주시면 조율에 도움이 돼요</h3>
      <div className="sheet__reasons">
        {OBJECTION_REASONS.map((r) => (
          <Button
            key={r}
            variant="secondary"
            full
            onClick={() => dispatch({ type: 'PROPOSAL_RESPOND', member: me, kind: 'objection', reason: r })}
          >
            {r}
          </Button>
        ))}
        <Button variant="ghost" full onClick={() => dispatch({ type: 'PROPOSAL_RESPOND', member: me, kind: 'objection', reason: '사유 미입력' })}>
          사유 없이 보내기
        </Button>
      </div>
      <Notice tone="weak">사유는 선택이에요. 루나님에게만 비공개로 전달돼요.</Notice>
    </div>
  )
}

/* ---------- 조율 모드: 슬롯 응답 입력/수정 ---------- */
function ResponseSheet() {
  const { state, dispatch } = useStore()
  const me = state.currentUser
  const already = isResponded(state, me)
  const preset = !already
  const [values, setValues] = useState(() => {
    if (already) return { ...state.coord[me] }
    const init = {}
    for (const slot of state.slots) init[slot.id] = CALENDAR_PRESET[me][slot.id]
    return init
  })
  const complete = state.slots.every((slot) => values[slot.id])

  return (
    <>
      <div className="sheet__body">
        <h3 className="sheet__title">{already ? '내 응답 수정하기' : '가능한 시간을 알려주세요'}</h3>
        {preset && <Notice tone="neutral">캘린더 기준으로 미리 채워뒀어요 — 다르면 바꿔주세요. 저장해야 반영돼요.</Notice>}
        <div className="sheet__slots">
          {state.slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              variant="respond"
              myValue={values[slot.id]}
              preset={preset}
              onChange={(v) => setValues((prev) => ({ ...prev, [slot.id]: v }))}
            />
          ))}
        </div>
        {already && <Notice tone="weak">일정이 바뀌면 언제든 수정할 수 있어요.</Notice>}
      </div>
      <div className="sheet__footer">
        <Button
          variant="primary"
          full
          disabled={!complete}
          onClick={() => dispatch({ type: 'COORD_RESPOND', member: me, responses: values })}
        >
          {already ? '수정 저장' : '응답 저장'}
        </Button>
      </div>
    </>
  )
}

/* ---------- 주최자: 현황 매트릭스 + 액션 ---------- */
function OrganizerSheet() {
  const { state, dispatch } = useStore()
  const proposalPhase = state.mode === 'proposal' || state.mode === 'proposalEscalated'
  const ranked = rankedSlots(state)
  const best = ranked[0]
  const canConfirm = best && best.ok > 0
  const afterDeadline = state.phase >= 3

  if (proposalPhase) {
    return (
      <div className="sheet__body">
        <h3 className="sheet__title">잠정 확정 현황</h3>
        <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
        <div className="matrix">
          {MEMBER_IDS.filter((id) => id !== 'runa').map((id) => (
            <div className="matrix__row" key={id}>
              <Avatar id={id} size="sm" />
              <span className="matrix__name">
                {MEMBERS[id].name}
                {/* 필참/선택 라벨은 주최자 화면 전용 (FGI F6) */}
                <Chip tone={isRequired(state, id) ? 'primary' : 'neutral'}>{isRequired(state, id) ? '필참' : '선택'}</Chip>
              </span>
              {state.proposal[id] === 'ok' ? (
                <Chip tone="success">확인</Chip>
              ) : isRequired(state, id) ? (
                <Chip tone="warn">확인 대기</Chip>
              ) : (
                <Chip tone="neutral">침묵 = 동의</Chip>
              )}
            </div>
          ))}
        </div>
        <Notice tone="weak">이의가 오면 나에게만 비공개로 전달되고, 후보 조율로 전환돼요.</Notice>
      </div>
    )
  }

  return (
    <>
      <div className="sheet__body">
      <h3 className="sheet__title">응답 현황</h3>
      {state.objection && (
        <Notice tone="warn">
          비공개 이의 — {MEMBERS[state.objection.member].name} · “{state.objection.reason}”
        </Notice>
      )}
      <MatrixTable slots={state.slots} memberIds={MEMBER_IDS} responses={state.coord}
        requiredIds={state.required} outMembers={state.outMembers} />

      {afterDeadline && state.escalated.length > 0 && (
        <div className="sheet__escalation">
          {state.escalated.map((id) => (
            <div className="matrix__row" key={id}>
              <span className="matrix__name">
                <Avatar id={id} size="sm" /> {MEMBERS[id].name} — 필참인데 마감까지 무응답이에요
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={state.reRequested[id]}
                onClick={() => dispatch({ type: 'ORG_REREQUEST', member: id })}
              >
                {state.reRequested[id] ? '다시 요청함' : '다시 요청'}
              </Button>
            </div>
          ))}
          <Notice tone="weak">다시 요청은 1회만 보낼 수 있어요 — “회의 확정에 응답만 남았어요”로 전달돼요.</Notice>
        </div>
      )}
      </div>

      {/* 확정 후보 — 생성 시트와 일관된 하단 고정 푸터 */}
      <div className="sheet__footer">
        <Button
          variant="primary"
          full
          disabled={!canConfirm}
          onClick={() => dispatch({ type: 'ORG_CONFIRM', slotId: best.slot.id })}
        >
          1순위로 확정 — {best ? `${best.slot.day} ${best.slot.time.slice(0, 5)} (가능 ${best.ok}명)` : ''}
        </Button>
        {afterDeadline && state.escalated.length > 0 && (
          <>
            <Notice tone="warn">지금 확정하면 무응답 필참자는 ‘확인 전’으로 표시돼요.</Notice>
            <Button variant="ghost" full onClick={() => dispatch({ type: 'ORG_EXTEND' })}>
              마감 연장하고 기다리기
            </Button>
          </>
        )}
      </div>
    </>
  )
}
