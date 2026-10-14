# Design System

<!--
📌 작성 규칙 (v2.0.1 Official Release)

[형식]
- 컬러: HEX 6자리 (#ffffff) 또는 rgba(0,0,0,0.1)
- 크기: 숫자+px 필수 (16px, -1.5px)
- LineHeight (중요):
  1. % 또는 소수점(1.5 등): 피그마 스타일에 %로 직접 입력됨 (바인딩 해제, 퍼센트 값 보존)
  2. px 명시 (24px 등): 피그마 배리어블과 스타일이 바인딩됨 (시스템 일관성 유지)
- Weight: 숫자(400, 700) 또는 이름(Regular, Bold). 피그마 스타일명과 일치 권장.
- 빈 값: - 로 표기

[시멘틱 타이포그래피 규칙]
- FontFamily 배리어블은 'fontFamily/primary'(의도), 'fontFamily/secondary'(실제 폴백) 이름으로 자동 생성됩니다.
- MD에 적힌 폰트명이 primary 변수의 '값'으로 할당되어 디자인 의도를 보존합니다.
- 폰트가 시스템에 없을 경우 secondary(Inter)로 지능적 바인딩 전환이 일어나 취소선 없는 환경을 구축합니다.
- FontWeight 배리어블은 'fontWeight/400' 처럼 입력 수치를 이름으로 생성하며 스타일명(Regular 등)이 값으로 할당됩니다.

[토큰 구조]
- Primitive: 기본 색상 팔레트 (원시값, 모드 무관)
- Semantic: 용도별 색상 (Light/Dark 모드별 Alias 지정). Light/Dark 값은 항상 Primitive 토큰명으로 바인딩하며, HEX를 직접 적지 않는다.

[Typography 그룹핑]
- ### 그룹명 으로 그룹 구분 (예: ### Display)
- 예: ### Display 아래 xl -> display/xl
-->

Source of truth: `src/tokens/tokens.css`, `src/styles.css`

이 문서는 코드에 정의된 디자인 시스템 값을 기록한다.
`src/tokens/tokens.css`의 CSS 커스텀 프로퍼티는 문법 제약상 하이픈(`--gray-100`, `--color-surface-sub-dark`)으로 선언되어 있지만, 이 문서는 Figma 배리어블로 가져오기 위한 파일이므로 템플릿 컨벤션에 맞춰 `/`를 그룹 구분자로 사용해 폴더 구조를 만든다.
매핑 규칙: (1) Primitive는 `src/tokens/tokens.css`의 주석 그룹명(gray, slate, blue, red, green, amber, alpha)을 상위 폴더로 쓰고 색상 고유값을 하위로 붙인다 (예: `--gray-100` -> `gray/100`, 이름이 없는 `white`/`black`은 각각 소속 그룹의 `gray/white`, `slate/black`). (2) Semantic은 하이픈을 그대로 `/`로 바꾼다 (예: `--color-surface-sub-dark` -> `surface/sub/dark`). 어떤 토큰의 경로가 다른 토큰의 상위 폴더와 겹치면(Figma는 같은 이름이 폴더이자 값일 수 없음) `/default`를 붙여 리프로 분리한다 — 최상위 그룹뿐 아니라 중첩된 경우에도 동일하게 적용한다 (예: `bg` -> `bg/default`, `surface-sub`는 `surface-sub-dark`와 경로가 겹치므로 `surface/sub/default`, `warn-text`는 `warn-text-strong`과 겹치므로 `warn/text/default`). `dim`, `overlay`, `black`, `white`처럼 다른 토큰과 경로를 공유하지 않는 단독 토큰은 그대로 둔다.
코드가 항상 source of truth이며, 이 문서의 `/` 표기는 어떤 CSS 변수에서 왔는지 위 규칙으로 항상 역추적 가능하다.
`src/styles.css`에서 CSS 커스텀 프로퍼티를 사용하지 않는 값은 토큰 표가 아닌 별도 노트로 기록한다.

## Colors

### Primitive

| Token | Value | Description |
|-------|-------|-------------|
| gray/white | #ffffff | Pure white (`--white`) |
| gray/50 | #f9fafb | Grayscale 50 / nested surface (`--gray-50`) |
| gray/100 | #f2f4f6 | Grayscale 100 / app background (`--gray-100`) |
| gray/200 | #e5e8eb | Grayscale 200 / border line (`--gray-200`) |
| gray/600 | #667180 | Grayscale 600 / weak text (`--gray-600`) |
| gray/700 | #5b6573 | Grayscale 700 / sub text (`--gray-700`) |
| gray/900 | #191f28 | Grayscale 900 / main body text (`--gray-900`) |
| slate/black | #000000 | Pure black (`--black`) |
| slate/900 | #0f1420 | Slate 900 / dark theme background (`--slate-900`) |
| slate/800 | #141a28 | Slate 800 / dark theme nested surface (`--slate-800`) |
| slate/750 | #1a2130 | Slate 750 / dark theme surface (`--slate-750`) |
| slate/700 | #1d2a44 | Slate 700 / dark active surface (`--slate-700`) |
| slate/650 | #212a3d | Slate 650 / dark hover surface (`--slate-650`) |
| slate/600 | #2a3345 | Slate 600 / dark border line (`--slate-600`) |
| slate/500 | #5c6878 | Slate 500 / dark muted text (`--slate-500`) |
| slate/400 | #7e8aa0 | Slate 400 / dark label text (`--slate-400`) |
| slate/300 | #8fa0b8 | Slate 300 / dark weak text (`--slate-300`) |
| slate/200 | #9aa5b5 | Slate 200 / dark tagline text (`--slate-200`) |
| slate/150 | #b7c0cd | Slate 150 / dark sub text (`--slate-150`) |
| slate/100 | #dfe5ee | Slate 100 / dark body text (`--slate-100`) |
| blue/50 | #e8f3ff | Brand blue 50 / primary weak (`--blue-50`) |
| blue/300 | #8fb4ff | Brand blue 300 / primary dark (`--blue-300`) |
| blue/600 | #1b64da | Brand blue 600 / primary action (`--blue-600`) |
| user/1 | #3182f6 | User avatar palette 1 / round-robin (`--user-1`) |
| user/2 | #7048e8 | User avatar palette 2 / round-robin (`--user-2`) |
| user/3 | #0ca678 | User avatar palette 3 / round-robin (`--user-3`) |
| user/4 | #f59f00 | User avatar palette 4 / round-robin (`--user-4`) |
| user/5 | #e64980 | User avatar palette 5 / round-robin (`--user-5`) |
| user/6 | #495057 | User avatar palette 6 / round-robin (`--user-6`) |
| red/50 | #fdedee | Status red 50 / danger weak (`--red-50`) |
| red/600 | #cc2b3d | Status red 600 / danger action (`--red-600`) |
| green/50 | #e6f6ee | Status green 50 / success weak (`--green-50`) |
| green/600 | #0e7a45 | Status green 600 / success action (`--green-600`) |
| amber/50 | #fff4e5 | Status amber 50 / warning weak (`--amber-50`) |
| amber/500 | #ff9500 | Status amber 500 / warning icon (`--amber-500`) |
| amber/800 | #8f5500 | Status amber 800 / warning text (`--amber-800`) |
| amber/900 | #8a5a00 | Status amber 900 / warning strong text (`--amber-900`) |
| alpha/dim | rgba(25,31,40,0.55) | Sheet backdrop alpha (`--alpha-dim`) |
| alpha/overlay | rgba(20,25,35,0.94) | Push notification overlay alpha (`--alpha-overlay`) |

### Semantic

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| bg/default | gray/100 | slate/900 | App background (`--color-bg`) |
| bg/dark | slate/900 | slate/900 | Dark theme background — presenter / judge UI (`--color-bg-dark`) |
| surface/default | gray/white | slate/750 | Cards, bubbles, sheets (`--color-surface`) |
| surface/dark | slate/750 | slate/750 | Dark theme surface — judge bar (`--color-surface-dark`) |
| surface/sub/default | gray/50 | slate/800 | Nested surface (`--color-surface-sub`) |
| surface/sub/dark | slate/800 | slate/800 | Dark theme nested surface — stage badge (`--color-surface-sub-dark`) |
| surface/hover/dark | slate/650 | slate/650 | Dark theme member card hover background (`--color-surface-hover-dark`) |
| surface/active/dark | slate/700 | slate/700 | Dark theme active member card background (`--color-surface-active-dark`) |
| line/default | gray/200 | slate/600 | Dividers, borders (`--color-line`) |
| line/dark | slate/600 | slate/600 | Dark theme border line (`--color-line-dark`) |
| text/default | gray/900 | slate/100 | Body text; code comment notes 16.6:1 contrast (`--color-text`) |
| text/dark | slate/100 | slate/100 | Dark theme body text (`--color-text-dark`) |
| text/sub/default | gray/700 | slate/150 | Secondary text; code comment notes 5.7:1 contrast (`--color-text-sub`) |
| text/sub/dark | slate/150 | slate/150 | Dark theme secondary text (`--color-text-sub-dark`) |
| text/weak/default | gray/600 | slate/300 | Weak text and hints; code comment notes 4.9:1 contrast (`--color-text-weak`) |
| text/weak/dark | slate/300 | slate/300 | Dark theme weak text (`--color-text-weak-dark`) |
| text/inverse | gray/white | gray/white | Inverse text / text on primary or dark background (`--color-text-inverse`) |
| text/tagline | slate/200 | slate/200 | Dark theme tagline text (`--color-text-tagline`) |
| text/label/dark | slate/400 | slate/400 | Dark theme label / caption text (`--color-text-label-dark`) |
| text/muted/dark | slate/500 | slate/500 | Dark theme muted text — unselected badge (`--color-text-muted-dark`) |
| primary/default | blue/600 | blue/300 | Primary action and confirmation (`--color-primary`) |
| primary/weak | blue/50 | slate/700 | Primary action background (`--color-primary-weak`) |
| primary/dark | blue/300 | blue/300 | Dark theme brand primary text — push notification app name (`--color-primary-dark`) |
| danger/default | red/600 | red/600 | Objection / difficult state (`--color-danger`) |
| danger/weak | red/50 | red/50 | Danger background (`--color-danger-weak`) |
| success/default | green/600 | green/600 | Confirmed / success state (`--color-success`) |
| success/weak | green/50 | green/50 | Success background (`--color-success-weak`) |
| warn/default | amber/500 | amber/500 | Background / icon only; not for text (`--color-warn`) |
| warn/text/default | amber/800 | amber/800 | Warning text (`--color-warn-text`) |
| warn/weak | amber/50 | amber/50 | Warning background (`--color-warn-weak`) |
| warn/text/strong | amber/900 | amber/900 | Strong warning text — hintbar, notice (`--color-warn-text-strong`) |
| dim | alpha/dim | alpha/dim | Sheet backdrop (`--color-dim`) |
| overlay | alpha/overlay | alpha/overlay | Push notification overlay surface (`--color-overlay`) |
| black | slate/black | slate/black | Pure black — phone frame, notch (`--color-black`) |
| white | gray/white | gray/white | Pure white — titles, inverse text (`--color-white`) |

User avatar colors are primitive-only: no semantic alias is defined. Components inject a chosen primitive through the component-local custom property `--avatar-bg` (not a design token), assigned by index round-robin.

All color values in `src/styles.css` have been tokenized and now reference CSS custom properties defined in `src/tokens/tokens.css`. No hardcoded raw color values remain.

## Spacing

### Primitive

| Token | Value | Description |
|-------|-------|-------------|
| space-1 | 4px | 4px grid unit |
| space-2 | 8px | 4px grid unit |
| space-3 | 12px | 4px grid unit |
| space-4 | 16px | 4px grid unit |
| space-5 | 20px | 4px grid unit |
| space-6 | 24px | 4px grid unit |

### Semantic

No semantic spacing alias tokens are defined in `src/tokens/tokens.css`.

Direct CSS spacing notes: additional layout values such as `1px`, `2px`, `3px`, `5px 10px`, `8px 12px`, `390px`, `720px`, and `780px` are used directly in `src/styles.css` and are not design tokens.

## Radius

### Primitive

| Token | Value | Description |
|-------|-------|-------------|
| radius-sm | 8px | Small radius |
| radius-md | 12px | Medium radius |
| radius-lg | 16px | Large radius |
| radius-full | 999px | Fully rounded pill / circle |

### Semantic

No semantic radius alias tokens are defined in `src/tokens/tokens.css`.

Direct CSS radius notes: `4px`, `8px solid #000`, `20px`, `24px`, `28px`, `32px`, and `40px` are used directly in `src/styles.css` and are not design tokens.

## Typography

### Body

| Token | Font | Size | Weight | LineHeight | LetterSpacing |
|-------|------|------|--------|------------|---------------|
| text-xs | Pretendard Variable | 12px | 400 | 150% | 0px |
| text-sm | Pretendard Variable | 14px | 400 | 150% | 0px |
| text-md | Pretendard Variable | 16px | 400 | 150% | 0px |
| text-lg | Pretendard Variable | 18px | 700 | 130% | 0px |
| text-xl | Pretendard Variable | 24px | 700 | 130% | 0px |

Typography source notes: `--font-family`, `--leading-tight`, `--leading-base`, `--weight-regular`, `--weight-medium`, `--weight-semibold`, and `--weight-bold` exist in `src/tokens/tokens.css`. The typography style rows above keep the original text token names with only `--` removed.

## Effects

| Token | Type | Color | X | Y | Blur | Spread |
|-------|------|-------|---|---|------|--------|
| shadow-card | drop-shadow | rgba(0,0,0,0.06) | 0 | 1px | 3px | 0 |
| shadow-sheet | drop-shadow | rgba(0,0,0,0.12) | 0 | -8px | 24px | 0 |
| shadow-banner | drop-shadow | rgba(0,0,0,0.16) | 0 | 4px | 16px | 0 |

Direct CSS effect notes: `0 24px 64px rgba(0,0,0,0.5)`, `filter: brightness(1.06)`, opacity values, and the sheet footer gradient are used directly in `src/styles.css` and are not effect tokens.

## Motion

Motion tokens in `src/tokens/tokens.css`: `ease-out` is `cubic-bezier(0.22, 1, 0.36, 1)`, `duration-fast` is `150ms`, and `duration-base` is `250ms`.
They are documented as notes because the provided template does not include a Motion table.

## Grid

No grid tokens are defined in `src/tokens/tokens.css`.

Direct CSS grid notes: layout values such as `repeat(3, 1fr)`, `auto 1fr auto auto`, `max-width: 82%`, `max-width: 92%`, and `max-height: 86%` are used directly in `src/styles.css` and are not grid tokens.

## Components

Component usage is defined in `src/styles.css`. Component mappings are intentionally not written as tables so the MD to Figma plugin only parses the template-supported token and style sections.
