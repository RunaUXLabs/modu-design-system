# ProposalBubble
> 계층 1 '잠정 확정' 버블. 시스템이 고른 슬롯을 크게 보이고, 침묵=동의 규칙 아래 확인/대기 현황을 노출. **여러 원자·분자를 조립한 유기체**.

**Tier** Organism · **Figma** `ChatRoom/Bubble/ProposalBubble` · **Source** `src/components/bubbles.jsx`

## 언제 쓰나
- `state.mode`가 잠정 확정(및 `proposalEscalated`)일 때 채팅방 스케줄링 버블로 렌더. 상태는 store에서 읽음(계정 시점별 분기).

## 설계 의도 (왜 이렇게 만들었나)
- **현재 서비스는 props 없이 store 구독**: 6명 시점 전환에 따라 같은 버블의 문구·CTA가 바뀐다. 이는 서비스 구현 선택이지 재사용 UI에 props 전달을 금지하는 일반 디자인 규칙은 아니다.
- **침묵=동의 · 집행 명의의 원칙**: 독촉의 주어는 주최자가 아니라 **시스템**. 그래서 Notice/Board 문구가 시스템 명의("응답하지 않은 분들은 참석 가능한 것으로 정리돼요")이고, 이는 '침묵=동의' 규칙의 UI 표현.
- **대기 현황을 Board로 하단 상시 노출 + 탭 시 시트**: 제안이 대화에 밀려 올라가 침묵을 낳는 문제를 차단(핀바와 함께). 침묵을 '보이게' 만든다.
- **호스트/필참/응답여부 분기**: 필참엔 '확인하기', 선택엔 '응답하기' + "안 해도 괜찮아요" — 강제 대신 규칙을 투명하게.

## React API
- **props 없음** — `useStore()`로 상태 구독. (계정=`state.currentUser`, 응답=`state.proposal`, 대기=`waitingIds(state)` 등)

## 코드 (서비스 구조 발췌)
```jsx
export function ProposalBubble() {
  const { state, dispatch } = useStore()
  const me = state.currentUser, mine = state.proposal[me]
  const waiting = waitingIds(state), escalated = state.mode === 'proposalEscalated', isHost = me === 'runa'
  return (
    <BubbleShell title={`${state.meeting.title} · ${state.meeting.duration}`} subtitle="캘린더와 회의룸이 모두 비는 시간으로 잡았어요">
      <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
      <Notice tone="neutral">어려우면 <b>{state.meeting.deadline}</b>까지 알려주세요. 이의가 없으면 그대로 확정돼요.</Notice>
      {!isHost && (
        <div className="bubble__actions">
          {mine === 'ok'
            ? <Chip tone="success">확인 완료 — 참석으로 정리됐어요</Chip>
            : <>
                <Button variant="primary" size="md" full onClick={() => dispatch({ type: 'SHEET', open: true })}>
                  {isRequired(state, me) ? '확인하기' : '응답하기'}
                </Button>
                {!isRequired(state, me) && <Notice tone="weak">응답하지 않아도 괜찮아요 — 참석 가능한 것으로 정리돼요.</Notice>}
              </>}
        </div>
      )}
      {waiting.length > 0 && (
        <Board waiting={waiting} suffix="님의 확인이 꼭 필요해요"
          deadline="응답하지 않은 분들은 참석 가능한 것으로 정리돼요"
          onClick={() => dispatch({ type: 'SHEET', open: true })} />
      )}
      {escalated && isHost && <Notice tone="warn">확인 기한이 지나 아직 확인하지 않은 필참자에게만 다시 알렸어요.</Notice>}
    </BubbleShell>
  )
}
```
관련 CSS: `.bubble__actions` · `.board` · `.board__deadline`

위 발췌는 일부 안내/세부 줄을 생략한다. 현재 서비스에는 슬롯 설명용 weak Notice도 있다. BubbleShell/SlotCard/기초 컴포넌트는 패키지에서 가져오지만 계정별 분기, Board div, 마감 처리와 문구는 서비스에 남는다.

## 사용 예시
```jsx
// bubbles.jsx의 SchedulingBubble 라우터가 mode에 따라 선택
{state.mode === '…' && <ProposalBubble />}
```
- ✅ Do: 분기(호스트/필참/응답여부)는 store 값으로. 문구·CTA는 계정 시점에 따라 달라짐.
- 현재 서비스 분기는 store 기준을 유지한다. 별도 재사용 컴포넌트 설계에서 props를 금지하는 규칙으로 확대하지 않는다.

## 토큰
하위 컴포넌트 토큰 상속(`--color-surface`, `--shadow-card`, `--radius-lg`, primary/warn 계열 …)

## Figma 매핑
- `ChatRoom/Bubble/ProposalBubble` — 껍데기(카드+헤더) + 인스턴스 조립
- 2026-10-14 Component 페이지에는 Proposal 조합 인스턴스가 여러 개 있다. 대표 상태 1종만 존재한다는 기존 설명은 정정한다. 독립된 ProposalBubble 공개 set/API와 BubbleShell 조합 인스턴스는 구분한다.

## Uses / Used by
- **Uses**: [BubbleShell](../molecules/bubble-shell.md), [SlotCard](../molecules/slot-card.md)(hero), [Notice](../atoms/notice.md), [Chip](../atoms/chip.md), [Button](../atoms/button.md), [NameFlow](../atoms/name-flow.md), Board
- **Used by**: ChatRoom(SchedulingBubble 라우터)
