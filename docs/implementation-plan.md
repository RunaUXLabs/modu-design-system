# modu 디자인 시스템 구현 계획

작성일: 2026-10-13

## 승인 후 진행 기록

추가 환경 설정 변경: 두 프로젝트의 packageManager 및 engines.pnpm을 2026-10-13 확인한 최신 pnpm 12.11.2로 맞췄다. 서비스 CI는 packageManager를 읽도록 구성했고 Node 요구 조건은 22.13.0 이상으로 설정했다. 사용자 요청에 따라 설치는 수행하지 않았으며 기존 pnpm 8 lockfile을 보존했다. 첫 설치 시 `pnpm install --no-frozen-lockfile`로 두 lockfile을 갱신해야 한다. 아래 pnpm 8.15.4 검증 기록은 업그레이드 이전의 이력이다.

아래 원 계획은 분석 시점의 기록이다. 2026-10-13 승인 후 초기 구현은 다음 결정으로 진행했다.

- 패키지: `modu-design-system@0.1.0`, pnpm 8.15.4, React + TypeScript, Vite ESM 및 tsc 선언 파일 생성.
- 공개 범위: 전체 Atom/Molecule. store 기반 Organism 및 기기/채팅 셸은 서비스에 유지.
- 데이터 결합: MembersProvider가 소비 앱의 멤버 정보를 공급하고 기존 id 기반 API와 색상 순환 규칙을 보존.
- 인라인 항목: 기존 마크업/스타일을 독립 컴포넌트로 추출. 누락된 React prop 계약은 [패키지 API](./package-api.md)에 명시.
- Chip.warn: 기존 CSS에 warn 정의가 있음을 확인해 구현하고 문서 CSS 요약의 누락 보완.
- 이관: 가이드라인 34개 파일 이동 후 해시 검증, 루트 토큰 명세 이동. 토큰 정본은 src/tokens/tokens.css.
- 로컬 검증: 라이브러리 테스트 19개, 타입 검사와 빌드 통과. tarball을 기존 modu/vendor에 포함하고 소비 앱에 설치하여 기존 앱 빌드 통과.
- 브라우저 검증: headless Chrome에서 회의 생성 → 비비 이의 제출 → 조율 슬롯 응답 저장까지 통과, JavaScript 오류 없음. 1440px 및 430px 뷰포트 캡처 확인. 문서상 402px 기기 프레임 유지.
- 설치 검증: frozen lockfile로 로컬 tarball 설치 확인. 공개 export 26개, JS/타입/CSS/문서 파일 확인. React 타입 정의를 공급한 TypeScript 소비 fixture 검증.
- CI: 소비 앱의 pnpm 버전을 현재 lockfile 생성 버전인 8.15.4로 맞춤. 실제 GitHub Actions 실행과 원격 배포는 수행하지 않음.
- 배포: 레지스트리 발행은 수행하지 않음. tarball을 소비 앱에 포함해 기존 GitHub Pages 빌드가 형제 저장소 없이 설치 가능하도록 유지.

후속 결정은 Figma 시각 회귀 기준, Organism 패키지화, React 19 검증, 비공개 레지스트리/이름 설정이다.

## 1. 현재 구조 확인

### 원본 서비스 저장소: `modu`

- 패키지 매니저: `pnpm-lock.yaml` 존재, 현재 `package.json`은 Vite 단일 앱 구조.
- 프레임워크: React 18 + Vite.
- TypeScript는 아직 적용되어 있지 않고, 현재 소스는 `.jsx` 중심이다.
- 디자인 시스템 기준 문서:
  - `DESIGN-SYSTEM.md`: md-to-figma 플러그인이 파싱하는 기계 판독 토큰 스펙.
  - `docs/design-system/README.md`: 문서 체계와 설계 원칙.
  - `docs/design-system/foundation-guide.md`: 토큰 해설.
  - `docs/design-system/atoms/*.md`
  - `docs/design-system/molecules/*.md`
  - `docs/design-system/organisms/*.md`
- 현재 구현 참조 소스:
  - `src/tokens.css`
  - `src/styles.css`
  - `src/components/primitives.jsx`
  - `src/components/SlotCard.jsx`
  - `src/components/Sheet.jsx`
  - `src/components/JudgeBar.jsx`
  - `src/components/ChatRoom.jsx`
  - `src/components/bubbles.jsx`
  - `src/store.jsx`, `src/data.js`

### 대상 디자인 시스템 저장소: `modu-design-system`

- 현재 `.git`만 있는 빈 저장소다.
- 이번 단계에서 생성한 문서:
  - `docs/implementation-plan.md`

## 2. 기준 문서와 적용 원칙

초기 분석에서는 기존 가이드라인을 기준으로 삼았다. **2026-10-14 사용자 확인 이후 SSOT는 실제 서비스 코드로 변경한다.** 문서나 Figma가 서비스와 다르면 차이를 기록하고 문서를 정정한다. 이미 이관된 항목은 분리 전 서비스 Git 코드도 참조해 순환 검증을 피한다. 토큰 정본은 현재 패키지 `src/tokens/tokens.css`이며 기존 서비스 값과 비교한다. 서비스 근거가 없는 규칙, 시각 스타일, variant, 상태를 임의로 추가하지 않는다. 아래 초기 분석 표와 결정 대기 항목은 당시 기록이며 현재 API/이관 결정은 [package-api.md](package-api.md), 확인한 차이는 [ssot-audit.md](ssot-audit.md)를 우선한다.

식별한 문서는 총 34개다: README, foundation-guide, 작성 템플릿 각 1개와 Atom 15개, Molecule 7개, Organism 9개. 모든 컴포넌트 문서는 아래 API 표에 대응하며, 템플릿은 문서 작성 규칙으로만 취급한다. 루트 `DESIGN-SYSTEM.md`는 별도 토큰 명세다.

이관 제안: 검토 후 `modu/docs/design-system` 전체를 대상 저장소의 `docs/design-system`으로 옮겨 상대 링크와 계층을 보존한다. 루트 토큰 명세의 위치와 소비 앱의 문서 링크를 함께 정리하고, 파일 목록 및 내용 일치 확인 후 원본 문서 경로를 정리한다. 이번 단계에서는 원본 문서를 이동하지 않았다.

문서에서 확인한 핵심 원칙:

- 컴포넌트는 Atom -> Molecule -> Organism으로 조립한다.
- 컴포넌트 1개 = 파일 1개. tier는 폴더/섹션으로만 표현하고 컴포넌트 이름에는 붙이지 않는다.
- 값의 정본은 `src/tokens.css` -> `DESIGN-SYSTEM.md`다.
- 컴포넌트는 semantic token만 참조한다. primitive token 직접 사용은 원칙적으로 금지한다.
- 예외: `user/1~6`은 아바타 유저 컬러용 primitive 전용이며 semantic alias가 없다.
- 색, tone, 상태는 가능한 한 base + instance/style override로 처리한다.
- 크기 variant는 문서에 명시된 컴포넌트에만 둔다.
- Figma에서는 인스턴스 재활용을 전제로 하며, 상위 컴포넌트가 하위 컴포넌트를 재생성하지 않는다.

## 3. 구현해야 할 디자인 토큰

### Color primitive

- `gray/white`, `gray/50`, `gray/100`, `gray/200`, `gray/600`, `gray/700`, `gray/900`
- `slate/black`, `slate/900`, `slate/800`, `slate/750`, `slate/700`, `slate/650`, `slate/600`, `slate/500`, `slate/400`, `slate/300`, `slate/200`, `slate/150`, `slate/100`
- `blue/50`, `blue/300`, `blue/600`
- `user/1` ~ `user/6`
- `red/50`, `red/600`
- `green/50`, `green/600`
- `amber/50`, `amber/500`, `amber/800`, `amber/900`
- `alpha/dim`, `alpha/overlay`

### Color semantic

- `bg/default`, `bg/dark`
- `surface/default`, `surface/dark`, `surface/sub/default`, `surface/sub/dark`, `surface/hover/dark`, `surface/active/dark`
- `line/default`, `line/dark`
- `text/default`, `text/dark`, `text/sub/default`, `text/sub/dark`, `text/weak/default`, `text/weak/dark`
- `text/inverse`, `text/tagline`, `text/label/dark`, `text/muted/dark`
- `primary/default`, `primary/weak`, `primary/dark`
- `danger/default`, `danger/weak`
- `success/default`, `success/weak`
- `warn/default`, `warn/text/default`, `warn/weak`, `warn/text/strong`
- `dim`, `overlay`, `black`, `white`

### Spacing

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px

Semantic spacing alias는 문서상 정의되어 있지 않다.

### Radius

- `radius-sm`: 8px
- `radius-md`: 12px
- `radius-lg`: 16px
- `radius-full`: 999px

Semantic radius alias는 문서상 정의되어 있지 않다.

### Typography

- `font-family`: Pretendard Variable 우선, Pretendard 및 시스템 폴백.
- `text-xs`: 12px, weight 400, line-height 150%, letter-spacing 0px
- `text-sm`: 14px, weight 400, line-height 150%, letter-spacing 0px
- `text-md`: 16px, weight 400, line-height 150%, letter-spacing 0px
- `text-lg`: 18px, weight 700, line-height 130%, letter-spacing 0px
- `text-xl`: 24px, weight 700, line-height 130%, letter-spacing 0px
- weight token: `regular` 400, `medium` 500, `semibold` 600, `bold` 700
- 접근성 규칙: 문장형 텍스트는 14px 이상.

### Effects

- `shadow-card`: `0 1px 3px rgba(0,0,0,0.06)`
- `shadow-sheet`: `0 -8px 24px rgba(0,0,0,0.12)`
- `shadow-banner`: `0 4px 16px rgba(0,0,0,0.16)`

### Motion

- `ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)`
- `duration-fast`: 150ms
- `duration-base`: 250ms

### 토큰이 아닌 직접 사용값

문서상 토큰으로 승격하지 않은 값은 그대로 직접 사용값으로 취급한다. 예: `1px`, `2px`, `3px`, `5px 10px`, `8px 12px`, `390px`, `720px`, `780px`, `402px`, `874px`, `38px`, grid 값, max-width/max-height 값, 폰 프레임 그림자, opacity, filter, 시트 footer gradient.

## 4. 컴포넌트 목록과 API 추출

### Atoms

표에서 "성격", "또는"으로 표시한 항목은 문서에 확정된 React API가 없는 경우다. 구현 시 사용할 prop 이름이나 타입으로 확정한 것이 아니며 검토가 필요하다.

| 컴포넌트 | Props / Variant / 상태 | 사용 규칙 |
|---|---|---|
| `Avatar` | `id` 필수, `size: 'md' | 'sm' = 'md'`, `dimmed = false` | `id`는 `MEMBERS` 키. 색 직접 지정 금지. 색은 index round-robin으로 `--user-1~6` 사용. |
| `Button` | `variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary'`, `size: 'md' | 'sm' = 'md'`, `full`, `disabled`, `onClick`, `children` | CTA는 primary, 보조는 secondary, 파괴적 액션은 danger, 텍스트 버튼은 ghost. 크기별 별도 컴포넌트 금지. |
| `Chip` | `tone: 'neutral' | 'primary' | 'danger' | 'success' | 'warn' = 'neutral'`, `children` | 상태 요약 전용. 버튼처럼 쓰지 않는다. 문서의 현재 CSS 설명에는 warn 구현 언급이 빠져 있어 확인 필요. |
| `DateDivider` | `children` 또는 `date` 텍스트 | 채팅 스크롤 상단 날짜 구분선. 중앙 정렬, 약한 색. |
| `Field` | `label`, `value`, `source?`, `showSource` 성격 | 회의 생성 폼의 라벨 + 값 박스 + source 힌트. 값은 확정 입력값이 아니라 제안값으로 보이게 한다. |
| `Icons` | `IconSettings`, `IconBack`, `IconSend`, `IconPin`; 명시 props 없음 | `currentColor` 기반. React SVG 속성은 camelCase. |
| `Label` | `children` 또는 `text` | JudgeBar 다크 표면의 섹션 라벨. |
| `MatrixCell` | `state: 'head' | 'ok' | 'hard' | 'none'`, `children` 또는 `value` | 폰 폭 안 컴팩트 표용 64px 셀. 상태색으로 분포 파악. |
| `MessageBubble` | `type: 'incoming' | 'mine'`, `children` | 방향은 비대칭 radius로 표현. mine은 primary-weak 배경. |
| `NameFlow` | `ids: string[]`, `suffix: ReactNode` | 빈 배열이면 렌더하지 않는다. 이름만 bold로 강조. |
| `Notice` | `tone: 'neutral' | 'weak' | 'warn' | 'danger' | 'success' = 'neutral'`, `children` | 문장형 안내이므로 14px 이상. weak는 배경 없이 본문 흐름에 녹인다. |
| `SectionTitle` | `children` 또는 `title` | 바텀 시트 섹션 라벨. 라벨 + 옆 1px 라인. |
| `SegButton` | `value?: 'ok' | 'hard'`, `onChange(v)`, `disabled` | 가능/어려움 이분 토글. 선택된 쪽만 success/danger로 채운다. |
| `StagePill` | `state: 'default' | 'past' | 'now'`, `children` 또는 `label` | 시간 흐름 단계 표시. 현재만 primary 강조, 지난 단계는 약하게. |
| `Board` | `waiting ids`, `suffix`, `deadline`, `onClick` 성격 | 대기/현황 안내 박스. 박스 전체가 응답 시트 진입 타깃. |

### Molecules

| 컴포넌트 | Props / Variant / 상태 | 사용 규칙 |
|---|---|---|
| `BubbleShell` | `title: string`, `subtitle?: string`, `children` | 모든 스케줄링 버블의 공통 껍데기. 헤더는 시스템 명의로 고정되는 구조. |
| `MatrixRow` | `member`, `req`, `states by slot` 성격 | 이름 열 + 상태 셀. 역할은 `필`/`선` 원형 배지로 컴팩트하게 표시. |
| `MatrixTable` | header slots + member rows | 주최자 응답 현황표. 폰 폭에 들어가는 컴팩트 표. |
| `MemberCard` | `id`, `active`, `onClick`, role desc 성격 | JudgeBar 시점 전환 카드. active만 primary border와 active surface. |
| `MessageRow` | `from`, `me`, `children` | incoming만 아바타+이름 노출. mine은 우측 정렬 및 아바타 생략. |
| `SlotCard` | `slot`, `variant: 'hero' | 'tally' | 'respond' = 'tally'`, `okCount`, `total`, `myValue?: 'ok' | 'hard'`, `best`, `preset`, `onChange`, `onClick` | 하나의 슬롯 개념을 hero/tally/respond 3맥락에서 재사용. tally는 카드 자체가 버튼. 색 칩은 내 상태, 게이지는 팀 쏠림으로 의미를 분리. |
| `StageTrack` | `phase` | `StagePill` 4개를 조립하고 phase로 default/past/now 상태 산출. |

### Organisms

| 컴포넌트 | Props / Variant / 상태 | 사용 규칙 |
|---|---|---|
| `ComposeCard` | 현재 문서상 props 없음, store 구독 | 주최자에게만 CTA 노출. 주최자가 아니면 `null`. |
| `ProposalBubble` | props 없음, store 구독 | 잠정 확정 버블. 호스트/필참/응답 여부 분기는 store 기준. props로 데이터 전달 금지. |
| `CoordinationBubble` | store 구독 성격 | 이의 발생 시 후보 슬롯 집계로 전환. 비공개 이의는 주최자에게만 warn Notice. |
| `ConfirmedBubble` | store 구독 성격 | 확정 슬롯, 참석자 아바타, 조율 영수증 표시. |
| `NoSlotBubble` | store 구독 성격 | 교집합 붕괴 실패 상태. 주최자에게 회복 CTA, 팀원에게는 조율 중 안내. |
| `JudgeBar` | store 구독 성격 | 제품 밖 데모/심사용 레이어. 시점 전환, 시간 흐름, 리셋 제공. |
| `Sheet` | store 구독 성격 | `.phone` 자식으로 렌더되어야 dim이 폰 안에 갇힌다. 모드별 본문 교체. |
| `ShellChatChrome` | `title`, `count`, `showPinbar`, `showPush`, `body slot` 성격 | header/pinbar/input 고정, Body slot 교체. push는 관련 있을 때만 표시. |
| `ShellPhone` | `screen slot` 성격 | iPhone 16 Pro 프레임. `.phone`은 `position: relative` + `overflow: hidden`. |

## 5. 누락 또는 모호한 부분

아래 항목은 구현 전 사용자 검토가 필요하다. 문서에 없는 규칙을 임의로 추가하지 않기 위해 보류해야 한다.

1. `modu-design-system`의 패키지 이름이 문서에 없다.
   - 제안 후보는 `@modu/design-system` 또는 `modu-design-system`이지만, 실제 이름은 결정 필요.

2. 공개 API 범위가 불명확하다.
   - Atom/Molecule 전체를 export할지, Organism까지 export할지 결정이 필요하다.
   - `JudgeBar`는 제품 밖 데모/심사용 레이어로 설명되어 있어 패키지 공개 컴포넌트에 포함할지 별도 판단이 필요하다.

3. store 결합 organism을 라이브러리에서 어떻게 다룰지 문서에 없다.
   - `ProposalBubble`, `ComposeCard`, `Sheet` 등은 현재 `useStore()`를 직접 구독한다.
   - 재사용 가능한 패키지로 만들려면 provider/store까지 함께 제공할지, 아니면 organism은 현재 앱 전용으로 두고 atom/molecule부터 패키지화할지 결정 필요.

4. 데이터 모델 타입 정의가 문서에 충분히 분리되어 있지 않다.
   - `MEMBERS`, slot, meeting, proposal/coord 응답 상태의 TypeScript interface가 문서상 명확하지 않다.
   - `SlotCard`의 `slot`은 `{day,date,time,room}`로만 기술되어 있고 필수/옵션 세부 타입은 추가 확인 필요.

5. `Chip`의 `warn` tone은 API 표에 있으나 현재 구현 설명에는 neutral/primary/danger/success만 언급된다.
   - `warn`을 구현 대상에 포함할지, 문서 오기인지 확인 필요.

6. `Board`, `Field`, `DateDivider`, `Label`, `MatrixCell`, `SectionTitle` 등은 "별도 React 컴포넌트 아님" 또는 "앱 인라인"으로 설명된 항목이 있다.
   - 패키지에서는 문서 원칙인 "컴포넌트 1개 = 파일 1개"에 맞춰 독립 컴포넌트화할지 검토 필요.

7. 접근성 세부 규칙이 일부만 명시되어 있다.
   - `Button`, `SegButton`, `SlotCard(tally)`의 role/aria 규칙은 코드 발췌 수준이며 전체 접근성 계약은 부족하다.
   - 단, 문서에 없는 aria 규칙을 디자인 규칙처럼 추가하지 않고, 구현 안정성/테스트 기준으로만 보완하는 것이 적절하다.

8. Figma mapping의 `styleButton`, `styleChip`, `styleNotice`, `styleSeg`, `styleCell`은 개념적으로 언급되어 있으나 실제 JS 유틸 구현 위치는 문서에 없다.
   - React 라이브러리에서는 CSS class/variant 매핑으로 대응하고, Figma 유틸은 패키지 범위 밖인지 확인 필요.

9. 테마 모드 전략이 과도기다.
   - 문서상 semantic color에는 Light/Dark 열이 있지만 앱은 모드 전환 대신 `-dark` 접미 토큰을 명시 참조한다.
   - 초기 구현은 문서대로 CSS custom properties와 explicit dark tokens를 제공하고, 런타임 theme switching은 추가하지 않는 것이 기준에 맞다.

10. 시각 회귀 기준이 문서에 없다.
    - 기존 Figma/현재 앱을 기준으로 캡처 비교를 할지, Storybook snapshot만 둘지 결정 필요.

## 6. pnpm 기반 패키지 구조 제안

초기에는 독립 저장소 단일 패키지로 시작하고, 필요할 때 monorepo로 확장한다.

```text
modu-design-system/
  docs/
    implementation-plan.md
    design-system/       # 검토 후 기존 가이드라인 이관
  src/
    tokens/
      tokens.css
      index.ts
    components/
      avatar/
      button/
      chip/
      ...
    index.ts
  package.json
  pnpm-lock.yaml
  tsconfig.json
  tsconfig.build.json
  vite.config.ts
  vitest.config.ts
  eslint.config.js
  README.md
```

권장 패키지 방향:

- package manager: pnpm
- language: TypeScript
- framework peer dependency: `react`, `react-dom`
- build: 기존 앱과 도구를 맞출 수 있는 Vite library mode를 우선 제안
- output:
  - ESM
  - TypeScript declaration
  - CSS asset: `dist/style.css` 또는 `src/tokens/tokens.css` export
- local verification:
  - 현재처럼 별도 저장소인 경우 `modu`에서 `pnpm add ../modu-design-system`으로 로컬 경로 의존성을 설치한다.
  - `workspace:`는 두 패키지를 같은 pnpm workspace에 등록할 때만 사용한다. 현재 구조에는 바로 적용하지 않는다.
  - 최종 설치 검증은 `pnpm pack`으로 만든 tarball을 소비 앱에 설치해 배포 파일 누락도 확인한다.
- publish:
  - 로컬 검증 중 `private: true`로 발행을 차단한다.
  - 비공개 레지스트리 배포 시에는 이 값을 제거하거나 false로 바꾸고, 레지스트리 및 접근 권한을 별도로 설정한다. `private: true`는 비공개 발행 설정이 아니다.

초기 의존성 제안:

- runtime peer: `react`, `react-dom`
- dev/build: `typescript`, `vite`, `@vitejs/plugin-react`, `vite-plugin-dts`
- test: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- docs/visual QA 후보: Storybook 또는 Ladle

단, 실제 의존성 설치와 설정 파일 작성은 다음 구현 단계에서 진행한다.

## 7. 빌드 및 테스트 전략

### 빌드

- `pnpm build`
  - TypeScript 타입 체크
  - library bundle 생성
  - `.d.ts` 생성
  - CSS 토큰 및 컴포넌트 스타일 배포물 포함 확인
  - React, React DOM 및 사용하는 런타임 서브패스를 external 처리해 소비 앱과 React가 중복되지 않게 한다.
  - package exports의 JS, 타입, CSS 경로와 CSS side effects 보존 여부를 설치된 tarball 기준으로 확인한다.

### 단위 테스트

- 컴포넌트 렌더링 smoke test
- props에 따른 class/state 렌더링 검증
- 이벤트 콜백 검증
  - `Button.onClick`
  - `SegButton.onChange`
  - `SlotCard.respond.onChange`
  - `SlotCard.tally.onClick`

### 접근성/상태 테스트

- disabled 상태에서 이벤트가 발생하지 않는지 확인.
- `SegButton`의 radiogroup 동작 확인.
- `Avatar`의 aria-label이 멤버명으로 들어가는지 확인.

### 스타일/토큰 테스트

- `tokens.css` export 존재 확인.
- 컴포넌트 CSS에서 raw color 사용을 금지하는 정적 검사 후보.
- semantic token 참조 원칙 검증 후보.

### 시각 회귀 테스트

- Storybook/Ladle에 문서상 대표 상태만 등록.
- atom/molecule부터 대표 variant를 캡처.
- organism은 store 결합 정책 결정 후 진행.

## 8. 구현 우선순위

### Phase 0. 문서 및 패키지 경계 확정

1. 패키지 이름 확정.
2. 공개 export 범위 확정.
3. store 결합 organism의 패키지 포함 여부 결정.
4. `Chip.warn` 처리 방침 확인.
5. `Board`, `Field` 등 인라인 항목의 독립 컴포넌트화 승인.
6. 가이드라인 이관 위치와 토큰 정본의 관리 위치 확정.

### Phase 1. 패키지 골격

1. `pnpm` 기반 `package.json` 생성.
2. TypeScript, Vite library build, declaration output 설정.
3. `src/index.ts` export 진입점 준비.
4. `tokens.css` 이관.
5. CSS import/export 전략 확정.

### Phase 2. Foundation tokens

1. `src/tokens/tokens.css`에 정본 토큰 이관.
2. token name mapping 문서 유지.
3. 색상 raw value와 semantic token 참조 원칙 점검.
4. spacing/radius/typography/effects/motion export 정리.

### Phase 3. Atom 구현

우선순위:

1. `Button`, `Avatar`, `Chip`, `Notice`
2. `SegButton`, `StagePill`, `MessageBubble`
3. `SectionTitle`, `Label`, `DateDivider`, `Icons`
4. `NameFlow`, `Field`, `Board`, `MatrixCell`

이 단계의 목표는 앱 의존도가 낮은 primitive를 먼저 안정화하는 것이다.

### Phase 4. Molecule 구현

우선순위:

1. `SlotCard`
2. `BubbleShell`
3. `MessageRow`
4. `MemberCard`, `StageTrack`
5. `MatrixRow`, `MatrixTable`

`SlotCard`는 variant와 상태 조합이 많아 테스트를 먼저 붙인다.

### Phase 5. Organism 구현 또는 앱 전용 유지 결정

1. `ShellPhone`, `ShellChatChrome`처럼 slot 중심인 shell부터 검토.
2. `Sheet`는 `.phone` 자식 렌더 구조 규칙을 보존해야 하므로 별도 검증.
3. `ProposalBubble`, `CoordinationBubble`, `ConfirmedBubble`, `ComposeCard`, `NoSlotBubble`은 store 결합 정책 확정 후 구현.
4. `JudgeBar`는 제품 밖 데모 레이어이므로 패키지 포함 여부를 별도로 결정.

### Phase 6. 로컬 앱 검증

1. `modu` 앱에서 로컬 패키지로 설치.
2. 기존 `src/components`와 단계적으로 교체.
3. 현재 화면과 시각/동작 차이 확인.
4. 문서에서 허용하지 않은 새 규칙이 생기지 않았는지 점검.

### Phase 7. 배포 준비

1. package metadata 정리.
2. private registry 설정.
3. changelog/release workflow 결정.
4. 소비 앱 설치 가이드 작성.

## 9. 다음 검토 포인트

구현 전에 아래 결정을 받아야 한다.

- 패키지 이름은 무엇으로 할지.
- 초기 공개 범위를 Atom/Molecule까지만 할지, Organism까지 포함할지.
- store 결합 organism을 라이브러리에 포함할지.
- 현재 인라인으로 문서화된 항목을 독립 React 컴포넌트로 만들지.
- `Chip.warn`을 실제 구현할지 문서 정정 대상으로 볼지.

## Storybook 진행 기록 (2026-10-14)

- React Vite 기반 Storybook 10.6.2, Docs와 Accessibility addon 설정 추가.
- Foundations, Atoms, Molecules, Integration 예제 구성. 기존 토큰과 variant는 변경하지 않음.
- 토큰 정본 CSS 파싱, Controls, 클릭/키보드/controlled 응답 play 함수 작성.
- 라이브러리 빌드와 Storybook 빌드 및 타입 검사 경계 분리.
- [실행 및 검토 가이드](storybook-guide.md) 작성. 현재 구성 의도와 보여주는 수준은 [Storybook 목적과 범위](storybook-scope.md)에 정리.
- 설치는 개발자가 직접 진행. Storybook 실행, 전용 타입 검사, 정적 빌드 및 브라우저 검토는 설치 후 검증 대상.
- 자동 전체 story 실행, 시각 회귀 CI 및 외부 공개는 이번 범위에 포함하지 않음.

## 10. 도구 전략 확인 자료

### 후속 Storybook 조합/서비스 화면 확장

- Overview MDX로 서비스 SSOT, 슬롯/children 대응 및 검토 순서 안내.
- Patterns는 실제 SchedulingBubble/Sheet 조합, Service Screens는 실제 ChatRoom/JudgeBar/StoreProvider를 재사용.
- 회의 생성/편집, 필참·선택 시점, 응답 preset/수정, 마감 이후 현황, 확정 및 실패 상태를 기존 액션으로 준비.
- danger를 미사용 API Reference로 분리하고 임의 서비스 액션 문구 제거.
- 서비스 CSS의 preview 범위 제한 및 React dedupe. 서비스 전용 테스트는 기본 라이브러리 테스트/배포 빌드와 분리.
- 서비스 예제는 형제 modu 저장소 필요. 정적 빌드/타입/테스트/브라우저 확인 결과는 [Storybook 가이드](storybook-guide.md)에 기록.

아래 자료는 패키징 전략 확인용이며 기존 디자인 규칙을 확장하지 않는다.

- [pnpm 패키지 소스 및 로컬 설치](https://github.com/pnpm/pnpm.io/blob/main/docs/package-sources.md)
- [pnpm workspace](https://github.com/pnpm/pnpm.io/blob/main/docs/workspaces.md)
- [Vite library mode 및 CSS 배포](https://github.com/vitejs/vite/blob/main/docs/guide/build.md)
- [npm package.json의 private 설정](https://docs.npmjs.com/files/package.json/)
- [npm 비공개 패키지 발행](https://docs.npmjs.com/creating-and-publishing-private-packages/)
# 최신 서비스 동기화 안내

2026-10-14: 위 초기 계획과 진행 이력 이후 서비스 내부 모듈의 변경을 독립 패키지에 반영했다. 현재 구조·API·검증은 [동기화 기록](synchronization.md), [패키지 API](package-api.md), [Storybook 가이드](storybook-guide.md)를 참조한다. 과거의 danger 지원 및 형제 서비스 체크아웃 필요 설명은 현재 계약이 아니다.

