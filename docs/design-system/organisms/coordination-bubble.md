# CoordinationBubble
> 계층 2 조율 버블 — 이의 발생 시 후보 슬롯 집계로 전환(폴백). SlotCard(tally) 리스트 + 응답/현황.

**Tier** Organism · **Figma** `ChatRoom/Bubble/CoordinationBubble` · **Source** `src/components/bubbles.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **잠정 확정 → 이의 → 조율 모드는 폴백**: 항상 투표를 여는 게 아니라 '필요할 때만'. 비공개 이의는 주최자에게만 warn Notice로 보임(공개 저격 방지).
- 각 후보는 [SlotCard](../molecules/slot-card.md)(tally)로 — 색 칩=내 상태, 게이지=팀 쏠림 분리. 미응답자는 마감 규칙으로 불참 정리(단, 지금 응답하면 재참여).

## React 구현
- `rankedSlots(state)`로 슬롯 정렬·best 계산, `state.coord[me]`로 내 응답. 호스트/팀원 분기(현황 보기 / 응답하기).

## Uses / Used by
- **Uses**: [BubbleShell](../molecules/bubble-shell.md), [SlotCard](../molecules/slot-card.md)(tally), [Notice](../atoms/notice.md), [Button](../atoms/button.md), [NameFlow](../atoms/name-flow.md), Board
- **Used by**: ChatRoom(SchedulingBubble)
