# 패키지 API와 이관 결정

2026-10-13: 구현 계획 승인 후 초기 패키지 이름을 `modu-design-system`, 버전을 `0.1.0`으로 설정했다. 이름과 공개 범위는 비공개 배포 준비 때 다시 검토할 수 있다.

## 기존 규칙과 구현 계약

2026-10-14 기준 SSOT는 실제 modu 서비스 코드다. 기존 문서는 코드 기반 설명이며 불일치는 서비스 기준으로 정정한다. 이 문서는 독립 패키지에 필요한 데이터 공급 및 TypeScript 계약을 설명하며 새 디자인 규칙을 추가하지 않는다. 정확한 타입은 공개 `.d.ts`와 `src/components`에서 확인한다. [점검 기록](ssot-audit.md)을 함께 참조한다.

| 항목 | 공개 API 및 처리 |
|---|---|
| Button | variant는 primary/secondary/ghost. size, full, disabled, onClick, children 및 표준 button 속성 지원, type 기본값 button. 최신 서비스에서 danger 정의 제거. JudgeBar advance/reset은 별도 native button |
| Avatar | id, size, dimmed 유지. MembersProvider의 등록 순서로 user/1~6 순환 |
| Chip | neutral, primary, danger, success, warn. 기존 CSS에서 warn 정의를 확인해 누락된 문서 요약 보완 |
| Notice | neutral, weak, warn, danger, success 및 children |
| SegButton | value?: ok/hard, onChange 필수, disabled. aria-label 선택 가능. radio 의미, 화살표/Home/End 및 roving tabindex는 접근성 구현 보완 |
| NameFlow | ids, suffix. 빈 ids는 null |
| DateDivider / Label / SectionTitle | children으로 기존 문서의 편집 텍스트 공급 |
| MessageBubble | type incoming/mine, children |
| StagePill | state default/past/now, children |
| MatrixCell | state head/ok/hard/none, children |
| Board | waiting, suffix, deadline, onClick. button으로 키보드 작동 지원. 서비스 bubbles에서도 공통 Board 사용 |
| Field | label, value, source?, showSource=true, onClick?, ariaLabel=label, children?. children으로 편집 UI를 삽입하며 편집 상태·저장 액션은 서비스 Sheet가 관리 |
| Icons | IconSettings, IconBack, IconSend, IconPin. 기존 벡터와 크기 유지, props 없음 |
| BubbleShell | title, subtitle?, children. 시스템 명의 고정 |
| MemberCard | id, active=false, desc?, onClick?. desc 또는 멤버 desc 표시. 특정 인물의 역할/일정을 라이브러리에 하드코딩하지 않음 |
| MessageRow | from, me, children. 받은 메시지에만 Avatar와 이름 표시 |
| SlotCard | hero / tally / respond 구분 타입. hero는 slot, tally는 slot·okCount·total과 선택적 myValue·best·onClick, respond는 slot·onChange와 선택적 myValue·preset |
| StageTrack | phase: 0/1/2/3. T0~T3 순서와 상태 계산 유지 |
| MatrixRow | id, slots, responses?, required?, absent?. 멤버 required 기본값 사용 |
| MatrixTable | slots, memberIds, responses?, requiredIds?, outMembers?. 순서는 소비 앱 제공. 서비스 OrganizerSheet에서도 공통 표를 사용하며 처리 액션은 서비스 소유 |

## 데이터 공급

`MembersProvider`의 `members`는 `Record<string, Member>`이며 객체 키가 기존 Avatar/NameFlow API의 id다. 등록 순서는 색상 배정에 영향을 주므로 소비 앱에서 안정적으로 유지한다. 라이브러리는 데모의 MEMBERS, 회의 상태 머신, 캘린더 데이터를 포함하지 않는다. 멤버 기반 컴포넌트 사용 시 Provider와 유효한 id가 필수이며, 누락 시 명시적인 오류를 낸다.

```ts
interface Member {
  id: string;
  name: string;
  desc?: string;
  required?: boolean;
}

interface Slot {
  id?: string;
  day: string;
  date: string;
  time: string;
  room: string;
}

type ResponseValue = 'ok' | 'hard';
```

MatrixSlot은 위 Slot의 id를 필수로 요구한다. 중복 없는 슬롯 id로 응답을 연결한다. MatrixResponses는 슬롯 id → ResponseValue이며 MatrixTable.responses는 멤버 id → MatrixResponses다. requiredIds를 전달하면 멤버 메타 대신 그 명단을 사용한다. outMembers/absent의 불참 표시는 미응답 셀에만 적용하며 기존 응답을 덮어쓰지 않는다. 이 API는 기존 앱 마크업과 상태 데이터의 대응을 타입으로 옮긴 것이다.

## 초기 공개 범위 밖

ComposeCard, ProposalBubble, CoordinationBubble, ConfirmedBubble, NoSlotBubble, Sheet, JudgeBar는 업무 상태와 useStore 결합 규칙을 기존 앱에 유지한다. ShellPhone과 ShellChatChrome도 초기 범위에서 제외한다. 이들의 문서는 이관되어 설계 근거로 보존되지만 패키지 export에는 포함되지 않는다.

## 문서 이관

`modu/docs/design-system`의 34개 파일을 이동한 직후 해시 일치를 확인했다. 루트 DESIGN-SYSTEM.md도 이관했다. 이후 경로와 warn 설명을 보완했으며, 2026-10-14에는 서비스 SSOT에 따라 미사용 상태, 슬롯 매핑, 인라인 기능 및 현재 패키지 API를 정정했다. 과거 발췌는 출처/범위를 구분한다. 기계 판독용 토큰 명세와 토큰 값은 변경하지 않았다.

## 남은 검증과 결정

Figma 원본과의 시각 회귀 기준, React 19 실행 검증, Organism 패키지화 여부와 실제 비공개 레지스트리 설정은 후속 범위다. 기존 서비스 연결 및 브라우저 흐름 검증은 구현 계획의 진행 기록에 남긴다.
