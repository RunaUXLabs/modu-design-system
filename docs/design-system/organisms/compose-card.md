# ComposeCard
> S1 생성 버블 — 회의 만들기 시작점. **주최자에게만** CTA 노출.

**Tier** Organism · **Figma** `ChatRoom/Bubble/ComposeCard` · **Source** `src/components/bubbles.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- 생성 단계엔 아직 채팅방에 아무것도 게시되지 않은 상태 → **주최자가 아니면 `null`**(다른 팀원 시점엔 안 보임). 시스템이 캘린더·회의룸을 읽어 먼저 시간을 고른다는 가치 제안을 Notice로.

## 코드 (현재 구현)
```jsx
export function ComposeCard() {
  const { state, dispatch } = useStore();
  if (state.currentUser !== 'runa') return null;
  return (
    <BubbleShell title={`${state.meeting.title} · ${state.meeting.duration}`} subtitle="조건을 정하면 시스템이 시간을 찾아 잠정 확정해요">
      <Notice tone="neutral">팀원들의 캘린더와 회의룸 예약 상황을 읽어 모두가 비는 시간을 먼저 골라요. 투표는 필요할 때만 열려요.</Notice>
      <div className="bubble__actions"><Button variant="primary" full onClick={openSheet}>회의 만들기</Button></div>
    </BubbleShell>
  );
}
```

## Uses / Used by
- **Uses**: [BubbleShell](../molecules/bubble-shell.md), [Notice](../atoms/notice.md), [Button](../atoms/button.md)
- **Used by**: ChatRoom(SchedulingBubble)
