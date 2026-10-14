# Matrix/Cell
> 주최자 현황표의 한 칸. 상태: head(헤더 라벨) · ok · hard · none.

**Tier** Atom · **Figma** `Matrix/Cell` · **Source** 앱 인라인(`.matrix__cell`, Sheet)

## 설계 의도 (왜 이렇게 만들었나)
- **좁은 폰 폭 안에 들어가는 컴팩트 표**를 위한 고정폭(64) 셀. 상태색(성공/위험/무응답)으로 한눈에 분포 파악. 값 자체는 TEXT 프로퍼티로 편집.

## React 구현
```jsx
<span className={`matrix__cell matrix__cell--${state}`}>{mark}</span>  // state: head|ok|hard|none
```
CSS: `.matrix__cell`(w64·radius-sm) · `--head/--ok/--hard/--none`

## 토큰
`--color-success(-weak)/danger(-weak)`, `--color-surface-sub`, `--color-text-weak`, `--radius-sm`, `--text-sm/xs`, `--weight-bold`

## Figma 매핑
`Matrix/Cell` base(none) + `styleCell('head|ok|hard|none')` · TEXT prop **Value**

## Uses / Used by
- **Used by**: [Matrix/Row](../molecules/matrix-row.md)
