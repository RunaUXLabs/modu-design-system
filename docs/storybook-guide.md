# Storybook 실행 및 검토

## 실행

Node 22.13.0 이상, pnpm 12.11.2를 사용합니다. 설치는 개발자가 직접 수행합니다.

```powershell
pnpm install --frozen-lockfile
pnpm run storybook
pnpm run typecheck:storybook
pnpm run test:service-stories
pnpm run build:storybook
```

기본 주소는 `http://localhost:6006`, 정적 결과는 `storybook-static/`입니다. 설정 변경 후 개발 서버를 재시작하세요. 라이브러리 Vite 설정과 Storybook 설정은 분리돼 있습니다.

## 검토 구성

| 영역 | 확인 내용 |
| --- | --- |
| Overview | 검토 순서와 구현 경계 |
| Foundations | CSS 정본에서 읽은 색상·타이포·간격·반경·그림자·모션 |
| Atoms / Molecules | 서비스가 사용하는 공통 UI의 형태, props, 상태 |
| Patterns / Bubble Composition | 회의 버블의 실제 조합과 슬롯 역할 |
| Patterns / Response Preview | 응답 카드 선택에 따른 카드·현황표 연동 |
| Service Screens / Meeting States | 편집, 필참/선택 참석, 응답, 마감, 확정, 실패 복구 |
| Service Screens / Workbench | 실제 시뮬레이터로 계정·시간·리셋 탐색 |

최신 서비스 구성에 맞춰 Integration과 API Reference 영역을 제거했습니다. 미사용 Button danger는 타입·CSS·Storybook에 남기지 않습니다. MembersProvider는 데이터 공급 API로 유지하되 독립 전시 영역은 만들지 않습니다.

## 예제와 패키지 경계

Atoms/Molecules는 `@design-system` alias로 이 저장소의 `src`를 사용합니다. `@modu-service`는 형제 저장소가 아닌 `examples/service`를 가리킵니다. 해당 폴더는 동기화 시점의 실제 feature/page/CSS를 보존한 예제 스냅샷이며 원본 서비스와 자동 연동되지 않습니다.

Service Screens는 StoreProvider에 CREATE, SWITCH_USER, PROPOSAL_RESPOND, COORD_RESPOND, ADVANCE, SHEET 액션을 전달해 시작 상태를 구성합니다. 이후 클릭은 서비스 reducer가 처리합니다. Controls는 시작 상태이며 화면을 조작한 후의 현재 상태와 다를 수 있습니다.

Field는 children으로 편집 UI를 받으며 편집 상태·저장은 서비스 예제가 담당합니다. Board, MatrixTable, SectionTitle도 실제 서비스와 같은 공통 UI를 사용합니다. 서비스 CSS는 PostCSS로 `:where(.sb-service-root)`에 한정해 일반 컴포넌트 예제에 전역 reset이 새지 않게 합니다. React/React DOM은 dedupe합니다.

예제·Storybook은 공개 export, 타입 선언, 배포 files에 포함하지 않습니다. 라이브러리 빌드와 Storybook은 모두 형제 서비스 체크아웃 없이 실행할 수 있습니다. 설치된 tarball 대신 현재 `src`를 렌더링하므로 패키지 설치 검증은 별도입니다.

## 검토 시 주의

- Button 3종과 크기 2종, full/disabled, callback을 확인합니다.
- 응답 선택, 키보드·focus, 현황표, 편집·저장·복구 흐름을 확인합니다.
- Docs의 가이드라인 링크와 현재 타입을 함께 확인합니다.
- play 실행 결과와 Accessibility 패널 결과를 별도로 확인합니다.
- Pretendard 로딩 조건을 맞춘 후 Figma와 시각 비교합니다.

서비스 phone의 402×874 고정 프레임을 보존하며 좁은 viewport에서는 스크롤합니다. light/chat/dark는 기존 배경을 재현하는 preview 설정이지 새 제품 테마가 아닙니다. 접근성 설정 `test: 'todo'`는 보고용입니다. 타입 검사·정적 빌드·DOM 테스트 통과가 전체 브라우저 상호작용이나 WCAG 통과를 의미하지 않습니다.

동기화 범위와 이번 검증 결과는 [동기화 기록](synchronization.md), 이전 이력은 [SSOT 점검](ssot-audit.md)과 [포트폴리오 기록](portfolio-case-study.md)을 참고합니다.
