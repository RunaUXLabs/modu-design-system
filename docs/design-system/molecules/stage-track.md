# StageTrack
> 시간 흐름 트랙 — StagePill(T0~T3)을 한 줄로. phase로 각 필의 상태 산출.

**Tier** Molecule · **Figma** `JudgeBar/StageTrack` · **Source** 앱 인라인(`.judge__stages`, JudgeBar)

## 설계 의도
- 시나리오 진행 단계를 한 줄 트랙으로 시각화. 현재 phase=now, 이전=past. '시간 진행' 버튼과 짝.

## React 구현
```jsx
<div className="judge__stages">
  {STAGES.map((s,i)=><StagePill key={s.key} state={i===phase?'now':i<phase?'past':'default'}>{s.label}</StagePill>)}
</div>
```

## Figma 매핑
`JudgeBar/StageTrack` · 내부: StagePill ×4

## Uses / Used by
- **Uses**: [StagePill](../atoms/stage-pill.md)
- **Used by**: [JudgeBar](../organisms/judgebar.md)
