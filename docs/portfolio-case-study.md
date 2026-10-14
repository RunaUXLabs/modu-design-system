# 디자인 시스템 구축 및 패키지화 기록

## 이력서용 요약

기존 Figma 디자인 시스템 가이드라인을 분석해 React·TypeScript 기반 컴포넌트 라이브러리로 분리하고, pnpm 기반 독립 빌드 및 로컬 패키지 소비 구조를 구축했다. 디자인 토큰과 25개 UI 컴포넌트를 정리하고, Storybook에 상태별 예제·API 문서·상호작용 검증 코드를 구성했다.

Storybook은 컴포넌트 상태뿐 아니라 실제 서비스 소스를 재사용하는 패턴/페이지 예제로 확장했다. 타입 검사·정적 빌드·개발 서버 시작은 확인했으며 전체 브라우저/play/접근성 검증은 완료하지 않았다. 검증된 범위만 표현한다. 비공개 npm 레지스트리 배포 경험은 아직 포함하지 않는다.

## 문제와 접근

기존 서비스의 디자인 규칙과 UI 구현이 서비스 코드 및 store에 결합되어 있었다. 초기에는 기존 가이드라인을 분석하여 Atom/Molecule을 분리했다. 이후 서비스 코드를 SSOT로 확인하고 Figma·문서·패키지를 대조하여 미사용 danger, 슬롯 속성 및 서비스 전용 기능 경계의 잘못된 설명을 정정했다. 토큰 값은 유지했으며 일정 선정, 예약 및 저장 로직은 패키지 밖에 둔다.

## 수행 내용과 근거

| 수행 내용 | 근거 |
| --- | --- |
| 기존 토큰과 컴포넌트 가이드라인 분석 및 이관 | [구현 계획](implementation-plan.md), [가이드라인](design-system/README.md) |
| 정본 CSS 토큰과 공개 API 분리 | [토큰](../src/tokens/tokens.css), [공개 export](../src/index.ts) |
| Atom 18개, Molecule 7개 및 데이터 주입 Provider | [API 계약](package-api.md), [MembersProvider](../src/members.tsx) |
| React peer dependency, ESM, 타입 선언, 명시적 CSS export | [package.json](../package.json), [Vite 설정](../vite.config.ts) |
| pnpm 기반 로컬 tarball 패키지와 서비스 소비 | [README](../README.md)의 로컬 소비 앱 절차 |
| controlled 입력, 키보드 및 렌더링 테스트 | src/components/atoms와 molecules의 테스트 파일 |
| 토큰·상태별 Storybook 예제, Docs 및 접근성 보고 설정 | [Storybook 가이드](storybook-guide.md), [Stories](../stories), [.storybook](../.storybook) |
| 실제 서비스 소스 재사용으로 패턴·화면 검증 환경 확장 | [서비스 preview](../stories/service/service-preview.jsx), [조합 예제](../stories/patterns/BubbleComposition.stories.tsx) |

## 설명할 수 있는 설계 결정

- React를 번들에 포함하지 않고 소비 앱의 React를 사용하는 peer dependency로 선언했다.
- 앱 store 대신 Provider로 멤버 데이터를 주입하여 UI와 서비스 데이터를 분리했다.
- SlotCard를 discriminated union으로 정의해 variant별 필수 props 계약을 표현했다.
- 응답은 controlled 값으로 관리하며 컴포넌트가 서비스의 결정 로직을 소유하지 않도록 했다.
- 토큰은 CSS 정본에서 읽고 Storybook용 값을 별도로 복제하지 않았다.
- Storybook 설정과 예제는 배포 번들 밖에 두고 독립적인 검토 환경으로 구성했다.
- 실제 서비스 feature/page/reducer를 예제 전용 스냅샷으로 동기화하고 기존 액션으로 시작 상태를 준비했다. 예제는 패키지 공개 범위 밖에 두며 형제 서비스 저장소 없이 Storybook을 실행한다. 원본 서비스와의 자동 동기화는 아니다.
- 로컬 tarball로 실제 소비 앱 설치를 확인하며 레지스트리 발행 전 패키지 경계를 검증했다.

## 검증 상태와 제한

최신 동기화에서는 라이브러리 단위 테스트 18개와 서비스 예제 테스트 8개, Storybook 타입 검사가 통과했다. 아래는 이전 단계의 검증 이력이며 최신 결과는 [동기화 기록](synchronization.md)을 참조한다. npm 레지스트리 발행·전체 브라우저 play·접근성 통과 경험으로 확대해 표현하지 않는다.

기존 라이브러리 단위 테스트 19개와 빌드 및 소비 앱 검증 기록이 있다. pnpm 12 업그레이드 이후 두 프로젝트의 설치 및 검증 완료는 개발자가 확인했다. 2026-10-14에 기존 라이브러리 타입 검사와 단위 테스트 19개를 재실행하여 통과했다. Storybook은 25개 story 파일, 92개 예제로 구성했으며 새 파일의 문법 및 로컬 import 경로를 확인했다. Storybook 전용 타입 검사, 정적 빌드, 브라우저 검토, play 및 접근성 결과는 새 의존성 설치 후 확인 대상이다.

React 19, 비공개 레지스트리 발행, 자동 시각 회귀 CI, 모든 상태의 Figma 픽셀 일치, 모든 컴포넌트의 WCAG 준수는 검증 완료로 표기하지 않는다. 개발 기간, 팀 규모, 재사용률 및 성능 개선 수치는 근거 없이 추가하지 않는다.

## 포트폴리오 증빙 준비

1. 토큰·대표 Atom·SlotCard·Matrix·조합 화면을 캡처한다.
2. Storybook 전용 타입 검사와 정적 빌드 실행 결과를 기록한다.
3. 클릭, disabled, 키보드 및 응답 선택 play 결과를 기록한다.
4. 접근성 문제와 대응 여부를 근거와 함께 정리한다.
5. 로컬 tarball 소비 검증의 과거 기록과 현재 서비스의 내부 모듈 사용을 구분한다. 현재 패키지 설치 재검증 결과는 별도로 남긴다.
6. 원본 가이드라인 대비 보존한 규칙, 발견한 모호함과 제외한 서비스 전용 영역을 설명한다.

다음 단계는 검증 결과 보강이며 비공개 레지스트리, 릴리스 버전 정책 및 CI 확장은 별도 결정 사항이다.

## 확장 구성 증빙

이전 확장에서는 29개 story 파일, 113개 예제를 구성했다. 서비스 최신본 동기화 후에는 27개 story 파일, 109개 예제와 Overview MDX가 있다. 미사용 API 전시를 제거하고 응답 조합을 Patterns에 배치했다. 서비스 화면 테스트 8개와 라이브러리 테스트 18개, 타입 검사 및 라이브러리·Storybook 빌드가 통과했다. play 작성과 브라우저 실행 통과는 구분하며 [동기화 기록](synchronization.md)을 기준으로 설명한다.
