# JudgeBar
> 테스터 컨트롤(제품 밖 레이어). 6명 시점 전환 · 시간 흐름 진행 · 리셋. 어두운 배경으로 제품과 분리.

**Tier** Organism · **Figma** `JudgeBar` · **Source** `src/components/JudgeBar.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **제품 밖 '심사/데모용' 레이어**라 다크 표면으로 제품과 시각 분리. 하나의 화면을 6명 시점·4단계로 검증할 수 있게 함(시연 도구).
- "**건드리지 않은 팀원만 기본 행동을 수행**" — 직접 응답한 팀원은 그 선택대로, 나머지는 기본 행동. 이 규칙을 하단 설명으로 명시.
- 서비스의 다음 단계·리셋은 `judge__advance`/`judge__reset` 클래스를 가진 별도 native button이다. Figma의 [Button](../atoms/button.md) 인스턴스 조립과 React 구현을 구분한다.

## React 구현
- `useStore` 기반. 3영역: 시점 전환(MemberCard ×6) · 시간 흐름(StageTrack + advance/reset) · 설명.
- 현재 Label, MemberCard, StageTrack은 패키지에서 import한다. 시간 진행/리셋과 역할 문구, store 분기는 서비스에 남는다. JudgeBar 자체는 패키지 export가 아니다.
- 다음 단계는 `state.phase >= 3 || state.mode === 'confirmed'`일 때 disabled다. 리셋은 RESET 액션을 보낸다.

## Figma 매핑
`JudgeBar` · 조립: [MemberCard](../molecules/member-card.md) ×6 · [StageTrack](../molecules/stage-track.md) · [Button](../atoms/button.md)(primary/ghost) · [Label](../atoms/label.md)

## Uses / Used by
- **React Uses**: MemberCard, StageTrack, Label. Avatar는 MemberCard 내부에서 사용. advance/reset은 native button.
- **Figma Uses**: MemberCard, StageTrack, Common/Button, Label.
- **Used by**: App(좌측 aside)
