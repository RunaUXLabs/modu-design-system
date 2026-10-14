# DateDivider
> 채팅 스크롤 상단의 날짜 구분선(중앙 정렬).

**Tier** Atom · **Figma** `ChatRoom/DateDivider` · **Source** 앱 인라인(`.chat__date`)

## 설계 의도
- 메신저 관습대로 대화 흐름에 날짜 앵커. 약한 색·중앙 정렬로 존재감 최소.

## React 구현
`<div className="chat__date">{TODAY_LABEL}</div>`  (앱 '오늘'은 2026-07-09로 고정)

## 토큰
`--text-xs`, `--color-text-weak`, `--space-4`

## Figma 매핑
`ChatRoom/DateDivider` · TEXT prop **Date**

## Used by
[Shell/ChatChrome](../organisms/shell-chatchrome.md) Body(채팅 스레드)
