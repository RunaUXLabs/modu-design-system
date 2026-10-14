/* ============================================================
   상태 머신 — 2계층 골조
   계층 1: 잠정 확정(침묵=동의) → 계층 2: 조율 모드(폴백)
   원칙: 모든 행동은 심사위원이 직접 할 수 있고,
        시간 진행 시 '건드리지 않은 팀원'만 기본 행동을 수행한다.
   ============================================================ */
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import {
  MEMBERS, MEMBER_IDS, REQUIRED_IDS, OPTIONAL_IDS,
  PROPOSAL_SLOT, COORD_SLOTS, WIDENED_SLOTS, CALENDAR_PRESET, DEFAULTS, MEETING_DEFAULT,
} from './data.js'

export const initialState = {
  phase: 0,                 // 0=T0 … 3=T3 (심사위원 시간 컨트롤)
  mode: 'compose',          // compose | proposal | proposalEscalated | coordination | confirmed | noslot
  required: ['runa', 'dan', 'mara'], // 주최자가 생성 시 선언 — 심사위원이 바꿀 수 있음
  meeting: MEETING_DEFAULT,          // 시스템이 대화를 읽고 미리 채운 회의 메타 (수정 가능)
  currentUser: 'runa',
  touched: {},              // 심사위원이 직접 행동시킨 팀원 → 기본 행동 취소
  proposal: {},             // memberId -> 'ok' | 'objection'
  objection: null,          // { member, reason } — 주최자에게만 노출
  slots: COORD_SLOTS,
  coord: {},                // memberId -> { slotId: 'ok' | 'hard' } (제출된 응답)
  outMembers: [],           // 마감 후 불참 처리된 선택 참석자
  escalated: [],            // 마감 후 무응답 필참자 → 주최자 에스컬레이션
  reRequested: {},
  confirmed: null,          // { slotId, via, absent, unconfirmedRequired }
  widened: false,
  hintOn: true,
  sheetOpen: false,
}

/* ---------- 순수 계산 ---------- */
export const isResponded = (s, id) => Boolean(s.coord[id])
export const isRequired = (s, id) => s.required.includes(id)
export const tally = (s, slotId) =>
  MEMBER_IDS.filter((m) => s.coord[m]?.[slotId] === 'ok').length

export function waitingIds(s) {
  if (s.mode === 'proposal' || s.mode === 'proposalEscalated') {
    // 필참자만 확인 탭 요구, 선택 참석자는 침묵=동의
    return s.required.filter((id) => id !== 'runa' && !s.proposal[id])
  }
  if (s.mode === 'coordination' || s.mode === 'noslot') {
    return MEMBER_IDS.filter((id) => !isResponded(s, id) && !s.outMembers.includes(id))
  }
  return []
}

/* 필참 응답자 전원 ok인 슬롯 중 가능 인원 최다 → 동률이면 이른 시간 */
export function rankedSlots(s) {
  return s.slots
    .map((slot) => {
      const reqRespondents = s.required.filter((id) => isResponded(s, id))
      const reqOk = reqRespondents.every((id) => s.coord[id][slot.id] === 'ok')
      return { slot, ok: tally(s, slot.id), reqOk, reqOkCount: reqRespondents.filter((id) => s.coord[id][slot.id] === 'ok').length }
    })
    .sort((a, b) => Number(b.reqOk) - Number(a.reqOk) || b.ok - a.ok || s.slots.indexOf(a.slot) - s.slots.indexOf(b.slot))
}
export const bestSlot = (s) => rankedSlots(s)[0]

/* 교집합 붕괴: 응답한 필참자 중 가능한 슬롯이 하나도 없는 사람이 존재 */
export function intersectionCollapsed(s) {
  return s.required.some(
    (id) => isResponded(s, id) && s.slots.every((slot) => s.coord[id][slot.id] !== 'ok'),
  )
}

/* ---------- 전이 헬퍼 ---------- */
function enterCoordination(s) {
  const coord = { ...s.coord, runa: pickPreset('runa', s.slots) } // 주최자 가능시간은 후보 산출에 이미 반영
  const next = { ...s, mode: 'coordination', coord, sheetOpen: false }
  // 빠른 응답자들의 기본 행동 (건드리지 않은 팀원만)
  for (const [id, res] of Object.entries(DEFAULTS.coordEnter)) {
    if (!next.touched[id] && !next.coord[id]) next.coord = { ...next.coord, [id]: { ...res } }
  }
  return next
}
function pickPreset(id, slots) {
  const out = {}
  for (const slot of slots) out[slot.id] = CALENDAR_PRESET[id][slot.id]
  return out
}
function maybeCollapse(s) {
  if (s.mode === 'coordination' && intersectionCollapsed(s)) return { ...s, mode: 'noslot' }
  if (s.mode === 'noslot' && !intersectionCollapsed(s)) return { ...s, mode: 'coordination' }
  return s
}
function confirmLayer1(s) {
  return { ...s, mode: 'confirmed', confirmed: { via: 'layer1', slot: PROPOSAL_SLOT, absent: [], unconfirmedRequired: [] }, sheetOpen: false }
}

/* ---------- 리듀서 (테스트를 위해 export) ---------- */
export function reducer(s, action) {
  switch (action.type) {
    case 'SWITCH_USER':
      return { ...s, currentUser: action.id, sheetOpen: false }
    case 'RESET':
      return { ...initialState, hintOn: s.hintOn }
    case 'TOGGLE_HINT':
      return { ...s, hintOn: !s.hintOn }
    case 'SHEET':
      return { ...s, sheetOpen: action.open }

    case 'UPDATE_MEETING':
      return { ...s, meeting: { ...s.meeting, ...action.patch } }

    /* 생성 — 주최자가 참석자와 필참을 선언하면 시스템이 잠정 확정 */
    case 'CREATE': {
      const required = ['runa', ...(action.required || ['dan', 'mara']).filter((id) => id !== 'runa')]
      return {
        ...s, mode: 'proposal', required, sheetOpen: false,
        touched: action.auto ? s.touched : { ...s.touched, runa: true },
      }
    }

    /* 계층 1: 잠정 확정에 대한 응답 (모든 계정에서 심사위원이 직접 가능) */
    case 'PROPOSAL_RESPOND': {
      const { member, kind, reason, auto } = action
      let next = {
        ...s,
        proposal: { ...s.proposal, [member]: kind },
        touched: auto ? s.touched : { ...s.touched, [member]: true },
        sheetOpen: false,
      }
      if (kind === 'objection') {
        // 이의는 주최자에게만 전달, 버블은 "다시 조율 중" → 조율 모드로 전환
        next = enterCoordination({ ...next, objection: { member, reason: reason || '사정이 있어요' } })
        next.phase = Math.max(next.phase, 1)
        return next
      }
      // 전원 명시 동의 시 즉시 확정 (마감 전이라도)
      const everyoneOk = MEMBER_IDS.filter((id) => id !== 'runa').every((id) => next.proposal[id] === 'ok')
      if (everyoneOk) return confirmLayer1(next)
      return next
    }

    /* 계층 2: 슬롯 응답 (제출/수정) */
    case 'COORD_RESPOND': {
      const { member, responses, auto } = action
      let next = {
        ...s,
        coord: { ...s.coord, [member]: { ...responses } },
        touched: auto ? s.touched : { ...s.touched, [member]: true },
        outMembers: s.outMembers.filter((id) => id !== member),
        escalated: s.escalated.filter((id) => id !== member),
        sheetOpen: auto ? s.sheetOpen : false,
      }
      return maybeCollapse(next)
    }

    /* 시간 진행 — 건드리지 않은 팀원만 기본 행동 */
    case 'ADVANCE': {
      if (s.phase >= 3 || s.mode === 'confirmed') return s

      /* 루나(주최자)의 기본 행동: 회의 생성 — phase는 소비하지 않음 */
      if (s.mode === 'compose') {
        return reducer(s, { type: 'CREATE', required: s.required, auto: !s.touched.runa })
      }

      const phase = s.phase + 1
      let next = { ...s, phase }

      if (s.mode === 'proposal') {
        for (const [id, act] of Object.entries(DEFAULTS.proposal)) {
          if (!next.touched[id] && !next.proposal[id]) {
            if (act.type === 'objection') {
              next = { ...next, proposal: { ...next.proposal, [id]: 'objection' }, objection: { member: id, reason: act.reason } }
            } else {
              next = { ...next, proposal: { ...next.proposal, [id]: 'ok' } }
            }
          }
        }
        if (next.objection || Object.values(next.proposal).includes('objection')) {
          next = enterCoordination(next)
        } else {
          const reqOk = next.required.every((id) => id === 'runa' || next.proposal[id] === 'ok')
          // 이의 없음: 선택 참석자의 침묵은 동의 → 필참 확인만 남으면 에스컬레이션
          next = reqOk ? confirmLayer1(next) : { ...next, mode: 'proposalEscalated' }
        }
        next.phase = phase
        return next
      }

      if (s.mode === 'proposalEscalated') {
        // 타겟 푸시를 받은 필참자의 기본 행동: 확인
        let n2 = { ...next }
        for (const id of next.required) {
          if (id !== 'runa' && !n2.proposal[id] && !n2.touched[id]) {
            n2 = { ...n2, proposal: { ...n2.proposal, [id]: 'ok' } }
          }
        }
        const reqOk = next.required.every((id) => id === 'runa' || n2.proposal[id] === 'ok')
        return reqOk ? { ...confirmLayer1(n2), phase } : n2
      }

      if (s.mode === 'coordination' || s.mode === 'noslot') {
        if (phase === 2) {
          for (const [id, res] of Object.entries(DEFAULTS.coordT2)) {
            if (!next.touched[id] && !next.coord[id]) next.coord = { ...next.coord, [id]: { ...res } }
          }
        }
        if (phase >= 3) {
          // 마감 처리 — 역할별 분기: 선택→불참, 필참→에스컬레이션
          const out = MEMBER_IDS.filter((id) => !next.required.includes(id) && !next.coord[id])
          const esc = next.required.filter((id) => id !== 'runa' && !next.coord[id])
          next = { ...next, outMembers: out, escalated: esc }
        }
        return maybeCollapse(next)
      }
      return next
    }

    /* 주최자 액션 */
    case 'ORG_REREQUEST':
      return { ...s, reRequested: { ...s.reRequested, [action.member]: true } }
    case 'ORG_EXTEND':
      return { ...s, phase: 2, outMembers: [], escalated: [] }
    case 'ORG_CONFIRM': {
      const slot = s.slots.find((x) => x.id === action.slotId)
      const absent = MEMBER_IDS.filter(
        (id) => s.outMembers.includes(id) || (s.coord[id] && s.coord[id][slot.id] !== 'ok'),
      )
      const unconfirmedRequired = s.required.filter((id) => id !== 'runa' && !s.coord[id])
      return {
        ...s, mode: 'confirmed', sheetOpen: false,
        confirmed: { via: 'layer2', slot, absent, unconfirmedRequired },
      }
    }
    case 'WIDEN': {
      const slots = WIDENED_SLOTS
      return maybeCollapse({
        ...s, slots, widened: true, mode: 'coordination',
        coord: { runa: pickPreset('runa', slots) },
        outMembers: [], escalated: [], phase: Math.min(s.phase, 2),
      })
    }
    default:
      return s
  }
}

/* ---------- Context ---------- */
const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  /* 재요청을 받은 댄의 기본 행동: 잠시 후 응답 (심사위원이 먼저 행동하면 취소) */
  useEffect(() => {
    const pending = Object.keys(state.reRequested).filter(
      (id) => !state.touched[id] && !state.coord[id],
    )
    if (!pending.length) return
    const t = setTimeout(() => {
      const cur = stateRef.current
      for (const id of pending) {
        if (!cur.touched[id] && !cur.coord[id]) {
          dispatch({ type: 'COORD_RESPOND', member: id, responses: DEFAULTS.danAfterRerequest, auto: true })
        }
      }
    }, 1600)
    return () => clearTimeout(t)
  }, [state.reRequested, state.touched, state.coord])

  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
export { MEMBERS, MEMBER_IDS, REQUIRED_IDS, OPTIONAL_IDS }
