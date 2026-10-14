# BubbleShell
> 스케줄링 버블 공통 껍데기 — "모두의 시간" 헤더(앱·제목·서브) + 콘텐츠 슬롯.

**Tier** Molecule · **Figma** `BubbleShell` (52:196) · **서비스** `modu/src/components/bubbles.jsx`에서 패키지 import · **패키지** `src/components/molecules/BubbleShell.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- **모든 버블 상태(생성/제안/조율/확정/붕괴)가 같은 껍데기를 공유** → 상태 전환이 '같은 메시지의 변화'로 읽힘. 헤더는 시스템 명의("모두의 시간")로 고정해 집행 주체가 시스템임을 각인.
- `children` 슬롯으로 상태별 콘텐츠만 갈아끼움 → 버블 조립의 공통 틀.

## React API
| prop | type | 설명 |
|---|---|---|
| `title` | string | 회의 제목·소요시간 |
| `subtitle` | string? | 상태 설명 |
| `children` | node | 상태별 본문(SlotCard·Notice·Button·Board 등) |

## 코드 (현재 구현)
```jsx
function BubbleShell({ title, subtitle, children }) {
  return (
    <div className="bubble">
      <div className="bubble__head">
        <span className="bubble__app">모두의 시간</span>
        <span className="bubble__title">{title}</span>
        {subtitle && <span className="bubble__subtitle">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}
```
CSS: `.bubble`(surface·radius 4/16·shadow) · `.bubble__head/app/title/subtitle`

## Figma 매핑
2026-10-14 확인: `BubbleShell`은 Notice 1, SlotCard, Notice 2, Button, Notice/Chip, Notice/Board 목적의 SLOT 여섯 개를 제공한다. 정의에서 TEXT App/Title/Subtitle prop은 확인되지 않았으므로 기존 표기를 정정한다. 헤더 내부 텍스트와 노출된 컴포넌트 속성은 다른 개념이다.

React는 children으로 콘텐츠 순서/개수를 전달한다. Figma 슬롯별 새 props/variant가 필요한 것은 아니다. 서비스의 bubble__actions/slots 등 조립 레이아웃과 업무 분기는 패키지 밖에 남는다.

Storybook Patterns/Bubble Composition은 실제 SchedulingBubble을 재사용하여 생성/제안/조율/확정/실패의 조합을 표시한다. Service Screens는 ChatRoom/Sheet까지 포함한다. 패턴 예제가 새 공개 API를 의미하지 않는다.

## Uses / Used by
- **Used by**: 모든 [버블](../organisms/proposal-bubble.md)
