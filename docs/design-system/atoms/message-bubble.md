# MessageBubble
> 채팅 말풍선. Type: incoming(받은) / mine(보낸). 비대칭 라디우스로 방향 구분.

**Tier** Atom · **Figma** `ChatRoom/MessageBubble` · **Source** 앱 인라인(`.chat__text`, Message)

## 설계 의도 (왜 이렇게 만들었나)
- **방향을 라디우스로**: incoming은 좌상단이 뾰족(4/16/16/16), mine은 우상단이 뾰족 — 꼬리 대신 모서리로 발신자를 암시. mine은 `primary-weak` 배경으로 '내 말'을 구분.

## React 구현
```jsx
<div className={`chat__text ${mine ? 'chat__text--mine' : ''}`}>{children}</div>
```
CSS: `.chat__text`(surface·radius 4/16/16/16·shadow-card) · `.chat__text--mine`(primary-weak·라디우스 반전)

## 토큰
`--color-surface/primary-weak`, `--radius-lg`(16), `--shadow-card`, `--text-md`

## Figma 매핑
`ChatRoom/MessageBubble` · Variant **Type(incoming/mine)** · TEXT prop **Text**

## Uses / Used by
- **Used by**: [MessageRow](../molecules/message-row.md)
