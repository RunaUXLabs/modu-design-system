# Chip
> 상태를 색으로 압축해 보여주는 작은 필. tone: neutral·primary·danger·success·warn.

**Tier** Atom · **Figma** `Common/Chip` · **Source** `src/components/primitives.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **색 하나로 상태를 즉시 전달** — 라벨을 읽지 않아도 성공/위험/대기를 인지. SlotCard의 '내 상태', 1순위 플래그 등에서 재사용.
- **Figma는 base+override**: tone variant를 굽지 않고 `styleChip`으로 fill·라벨색 오버라이드(변수 바인딩) → variant 폭발 방지.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `tone` | neutral·primary·danger·success·warn | `'neutral'` | 색 |
| `children` | node | — | 라벨 |

## 코드 (현재 구현)
```jsx
export function Chip({ tone = 'neutral', children }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}
```
CSS: `.chip` · `.chip--neutral/primary/danger/success/warn` (neutral만 보더). warn은 기존 CSS와 동일하게 `--color-warn-weak` 배경과 `--color-warn-text` 텍스트를 사용한다.

## 사용 예시
```jsx
<Chip tone="success">가능해요</Chip>
<Chip tone="neutral">지금 1순위</Chip>
```
- ✅ Do: 상태 요약에만. ❌ Don't: 버튼처럼 쓰지 말 것(비인터랙티브).

## 토큰
`--color-surface-sub/primary-weak/danger-weak/success-weak`, 대응 텍스트색, `--radius-full`, `--text-xs`, `--weight-semibold`, `--color-line`(neutral 보더)

## Figma 매핑
`Common/Chip` (110:1252) · Size **md/sm** · TEXT **Label**. tone은 인스턴스 색 오버라이드다. `styleChip`은 과거 매핑 설명이며 현재 유틸 호출을 확인한 것이 아니다.

md는 padding 4/8, text 12/600으로 서비스 Chip과 대응한다. Figma sm은 20×20이다. 서비스 Matrix의 필/선은 Chip이 아닌 `.matrix__role`로 렌더링하며 패키지 Chip에는 size prop이 없다. Figma sm을 이유로 Chip API가 누락됐다고 판단하지 않는다.

## Uses / Used by
- **Uses**: —
- **Used by**: [SlotCard](../molecules/slot-card.md), [ConfirmedBubble](../organisms/confirmed-bubble.md), [ProposalBubble](../organisms/proposal-bubble.md)
