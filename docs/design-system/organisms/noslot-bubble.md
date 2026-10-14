# NoSlotBubble
> 교집합 붕괴 — **설계된 실패 상태**. 모두 가능한 시간이 없을 때. 주최자에겐 '기간 넓히기' CTA.

**Tier** Organism · **Figma** `ChatRoom/Bubble/NoSlotBubble` · **Source** `src/components/bubbles.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **실패를 숨기지 않고 명시적 상태로 설계**: 교집합이 없을 수 있다는 걸 인정하고, 주최자에게 회복 경로(기간 넓히기 / 필참 조정)를 제시. 팀원에겐 "주최자가 다시 조율 중"이라고만(불필요한 부담 차단).

## 코드 (현재 구현)
```jsx
<BubbleShell title="다음 주엔 모두 가능한 시간이 없어요" subtitle="꼭 참석해야 하는 분들의 일정이 겹치지 않아요">
  {isHost
    ? <div className="bubble__actions"><Button variant="primary" full onClick={()=>dispatch({type:'WIDEN'})}>기간을 넓혀 다시 찾기</Button><Notice tone="weak">또는 필참 구성을 조정해보세요…</Notice></div>
    : <Notice tone="neutral">루나님이 일정을 다시 조율하고 있어요.</Notice>}
</BubbleShell>
```

## Uses / Used by
- **Uses**: [BubbleShell](../molecules/bubble-shell.md), [Button](../atoms/button.md), [Notice](../atoms/notice.md)
- **Used by**: ChatRoom(SchedulingBubble)
