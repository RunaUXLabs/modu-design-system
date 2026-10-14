# Label
> 다크 표면(테스터 바)의 섹션 라벨 — '시점 전환', '시간 흐름'.

**Tier** Atom · **Figma** `JudgeBar/Label` · **Source** 앱 인라인(`.judge__label`)

## 설계 의도
- 다크 컨트롤 바 안에서 각 행의 성격을 알리는 작은 라벨(xs·semibold·자간). 다크 표면용 텍스트 토큰 사용.

## React 구현
`<span className="judge__label">시점 전환</span>`

## 토큰
`--text-xs`, `--weight-semibold`, `--color-text-label-dark`

## Figma 매핑
`JudgeBar/Label` · TEXT prop **Text**

## Used by
[JudgeBar](../organisms/judgebar.md)
