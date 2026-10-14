# StagePill
> 시간 흐름 단계 표시 필(T0~T3). 상태: default·past·now.

**Tier** Atom · **Figma** `JudgeBar/StagePill` · **Source** 앱 인라인(`.judge__stage`, JudgeBar)

## 설계 의도 (왜 이렇게 만들었나)
- 테스터 바에서 시나리오의 **시간축(T0→T3)을 작은 필**로 압축. 현재(now)만 primary로 강조, 지난 단계(past)는 약하게.

## React 구현
```jsx
<span className={`judge__stage ${i===phase?'judge__stage--now':''} ${i<phase?'judge__stage--past':''}`}>{s.label}</span>
```
CSS: `.judge__stage` · `--now`(primary) · `--past`

## Figma 매핑
`JudgeBar/StagePill` · Variant **State(default/past/now)** · TEXT prop **Label**

## Uses / Used by
- **Used by**: [StageTrack](../molecules/stage-track.md) → [JudgeBar](../organisms/judgebar.md)
