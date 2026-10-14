# 파운데이션 가이드 (토큰 해설)

> 색·간격·라디우스·타이포·이펙트·모션 값 체계의 **해설 문서**. 사람이 읽는 트랙이다.

## 문서 두 트랙 — 역할이 다르다

| 문서 | 성격 | 다루는 것 |
|---|---|---|
| [`DESIGN-SYSTEM.md`](../../DESIGN-SYSTEM.md) (루트) | **기계 판독 스펙** — 자사 **md-to-figma** 플러그인이 파싱해 Figma 배리어블·스타일을 생성. 이식하면 그대로 반영된다 | 템플릿 규약을 지킨 토큰 표. 규약을 깨는 편집 금지 |
| **이 문서** `foundation-guide.md` | **사람용 해설** | 2계층 구조, CSS↔Figma 매핑 규칙, 토큰 용도·대비율, 직접 사용값 노트, 동기화 메모 |

- **값의 정본**: `src/tokens/tokens.css` → `DESIGN-SYSTEM.md`. 이 문서의 표는 **읽기 편의용 미러**이며, 불일치하면 정본이 우선한다.
- **반영 순서**: `tokens.css` 수정 → `DESIGN-SYSTEM.md` 갱신 → md-to-figma로 이식 → (필요 시) 이 가이드 미러 갱신.
- 동기화 산출물(역-export 로그): `figma-scripts/EXPORTED-DESIGN(user).md`

---

## 토큰 아키텍처 — 2계층

| 계층 | 성격 | 규칙 |
|---|---|---|
| **Primitive** | 기본 색상 팔레트(원시값). 모드 무관 | HEX/rgba 원시값을 직접 가짐 |
| **Semantic** | 용도별 토큰. Light/Dark 모드별 Alias | **항상 Primitive 토큰명으로 바인딩**. HEX를 직접 적지 않는다 |

컴포넌트는 **Semantic만 참조**한다. Primitive를 컴포넌트에서 직접 쓰지 않는다(팔레트 교체 가능성 확보).

### 명명·매핑 규칙 (CSS ↔ Figma)

`tokens.css`는 CSS 문법 제약상 하이픈(`--gray-100`, `--color-surface-sub-dark`)으로 선언한다.
Figma 배리어블은 `/`를 그룹 구분자로 써 폴더 구조를 만들므로, 아래 규칙으로 1:1 변환한다.

1. **Primitive** — `tokens.css`의 주석 그룹명(gray, slate, blue, red, green, amber, alpha)을 상위 폴더로, 고유값을 하위로.
   `--gray-100` → `gray/100`. 이름 없는 `white`/`black`은 소속 그룹에 붙여 `gray/white`, `slate/black`.
2. **Semantic** — 하이픈을 그대로 `/`로. `--color-surface-sub-dark` → `surface/sub/dark`.
3. **경로 충돌 시 `/default`로 리프 분리** — Figma는 같은 이름이 폴더이자 값일 수 없다. 최상위뿐 아니라 중첩에도 동일 적용.
   `bg` → `bg/default` · `surface-sub`(≠`surface-sub-dark`) → `surface/sub/default` · `warn-text`(≠`warn-text-strong`) → `warn/text/default`
4. `dim`, `overlay`, `black`, `white`처럼 경로를 공유하지 않는 단독 토큰은 그대로 둔다.

> 이 규칙 덕에 Figma의 `/` 표기에서 **어떤 CSS 변수에서 왔는지 항상 역추적** 가능하다.

### 타이포그래피 배리어블 규칙 (MD→Figma)
- `fontFamily/primary`(의도) · `fontFamily/secondary`(폴백, Inter)로 자동 생성. MD의 폰트명이 primary **값**으로 들어가 디자인 의도를 보존하고, 시스템에 폰트가 없으면 secondary로 지능적 바인딩 전환된다.
- `fontWeight/400`처럼 수치를 **이름**으로, 스타일명(Regular 등)을 **값**으로 생성.
- LineHeight: `%`·소수점은 퍼센트로 직접 입력(바인딩 해제), `px` 명시는 배리어블 바인딩.

---

## Colors · Primitive

| Token | Value | Description |
|-------|-------|-------------|
| gray/white | #ffffff | Pure white (`--white`) |
| gray/50 | #f9fafb | 중첩 표면 (`--gray-50`) |
| gray/100 | #f2f4f6 | 앱 배경 (`--gray-100`) |
| gray/200 | #e5e8eb | 보더·구분선 (`--gray-200`) |
| gray/600 | #667180 | 약한 텍스트 (`--gray-600`) |
| gray/700 | #5b6573 | 보조 텍스트 (`--gray-700`) |
| gray/900 | #191f28 | 본문 텍스트 (`--gray-900`) |
| slate/black | #000000 | Pure black (`--black`) |
| slate/900 | #0f1420 | 다크 배경 (`--slate-900`) |
| slate/800 | #141a28 | 다크 중첩 표면 (`--slate-800`) |
| slate/750 | #1a2130 | 다크 표면 (`--slate-750`) |
| slate/700 | #1d2a44 | 다크 active 표면 (`--slate-700`) |
| slate/650 | #212a3d | 다크 hover 표면 (`--slate-650`) |
| slate/600 | #2a3345 | 다크 보더 (`--slate-600`) |
| slate/500 | #5c6878 | 다크 muted 텍스트 (`--slate-500`) |
| slate/400 | #7e8aa0 | 다크 라벨 텍스트 (`--slate-400`) |
| slate/300 | #8fa0b8 | 다크 약한 텍스트 (`--slate-300`) |
| slate/200 | #9aa5b5 | 다크 태그라인 (`--slate-200`) |
| slate/150 | #b7c0cd | 다크 보조 텍스트 (`--slate-150`) |
| slate/100 | #dfe5ee | 다크 본문 텍스트 (`--slate-100`) |
| blue/50 | #e8f3ff | primary weak (`--blue-50`) |
| blue/300 | #8fb4ff | primary dark (`--blue-300`) |
| blue/600 | #1b64da | primary action (`--blue-600`) |
| red/50 | #fdedee | danger weak (`--red-50`) |
| red/600 | #cc2b3d | danger action (`--red-600`) |
| green/50 | #e6f6ee | success weak (`--green-50`) |
| green/600 | #0e7a45 | success action (`--green-600`) |
| amber/50 | #fff4e5 | warning weak (`--amber-50`) |
| amber/500 | #ff9500 | warning icon — **텍스트 사용 금지**(대비 2.1:1) (`--amber-500`) |
| amber/800 | #8f5500 | warning text (`--amber-800`) |
| amber/900 | #8a5a00 | warning strong text (`--amber-900`) |
| alpha/dim | rgba(25,31,40,0.55) | 시트 backdrop (`--alpha-dim`) |
| alpha/overlay | rgba(20,25,35,0.94) | 푸시 오버레이 (`--alpha-overlay`) |
| user/1 ~ user/6 | #3182f6 · #7048e8 · #0ca678 · #f59f00 · #e64980 · #495057 | **유저 아바타 6색** — 인덱스 round-robin (`--user-1`~`--user-6`) |

## Colors · Semantic

Light/Dark는 **Primitive 토큰명으로 바인딩**한다(HEX 직접 기입 금지).

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| bg/default | gray/100 | slate/900 | 앱 배경 (`--color-bg`) |
| bg/dark | slate/900 | slate/900 | 다크 배경 — 테스터 UI (`--color-bg-dark`) |
| surface/default | gray/white | slate/750 | 카드·버블·시트 (`--color-surface`) |
| surface/dark | slate/750 | slate/750 | 다크 표면 — 테스터 바 (`--color-surface-dark`) |
| surface/sub/default | gray/50 | slate/800 | 중첩 표면 (`--color-surface-sub`) |
| surface/sub/dark | slate/800 | slate/800 | 다크 중첩 표면 (`--color-surface-sub-dark`) |
| surface/hover/dark | slate/650 | slate/650 | 다크 hover (`--color-surface-hover-dark`) |
| surface/active/dark | slate/700 | slate/700 | 다크 active (`--color-surface-active-dark`) |
| line/default | gray/200 | slate/600 | 구분선·보더 (`--color-line`) |
| line/dark | slate/600 | slate/600 | 다크 보더 (`--color-line-dark`) |
| text/default | gray/900 | slate/100 | 본문 — **16.6:1** (`--color-text`) |
| text/dark | slate/100 | slate/100 | 다크 본문 (`--color-text-dark`) |
| text/sub/default | gray/700 | slate/150 | 보조 — **5.7:1** (`--color-text-sub`) |
| text/sub/dark | slate/150 | slate/150 | 다크 보조 (`--color-text-sub-dark`) |
| text/weak/default | gray/600 | slate/300 | 약한 텍스트·힌트 — **4.9:1** (`--color-text-weak`) |
| text/weak/dark | slate/300 | slate/300 | 다크 약한 텍스트 (`--color-text-weak-dark`) |
| text/inverse | gray/white | gray/white | 반전 텍스트 (`--color-text-inverse`) |
| text/tagline | slate/200 | slate/200 | 다크 태그라인 (`--color-text-tagline`) |
| text/label/dark | slate/400 | slate/400 | 다크 라벨·캡션 (`--color-text-label-dark`) |
| text/muted/dark | slate/500 | slate/500 | 다크 muted — 미선택 배지 (`--color-text-muted-dark`) |
| primary/default | blue/600 | blue/300 | 주요 액션·확정 (`--color-primary`) |
| primary/weak | blue/50 | slate/700 | 주요 액션 배경 (`--color-primary-weak`) |
| primary/dark | blue/300 | blue/300 | 다크 브랜드 텍스트 — 푸시 앱명 (`--color-primary-dark`) |
| danger/default | red/600 | red/600 | 이의·어려움 (`--color-danger`) |
| danger/weak | red/50 | red/50 | danger 배경 (`--color-danger-weak`) |
| success/default | green/600 | green/600 | 확정·성공 (`--color-success`) |
| success/weak | green/50 | green/50 | success 배경 (`--color-success-weak`) |
| warn/default | amber/500 | amber/500 | 배경·아이콘 전용 — **텍스트 금지** (`--color-warn`) |
| warn/text/default | amber/800 | amber/800 | 경고 텍스트 (`--color-warn-text`) |
| warn/weak | amber/50 | amber/50 | 경고 배경 (`--color-warn-weak`) |
| warn/text/strong | amber/900 | amber/900 | 강한 경고 텍스트 — 힌트바·notice (`--color-warn-text-strong`) |
| dim | alpha/dim | alpha/dim | 시트 backdrop (`--color-dim`) |
| overlay | alpha/overlay | alpha/overlay | 푸시 오버레이 (`--color-overlay`) |
| black | slate/black | slate/black | 폰 프레임·노치 (`--color-black`) |
| white | gray/white | gray/white | 타이틀·반전 텍스트 (`--color-white`) |


> `src/styles.css`의 모든 색은 토큰화되어 있다. **하드코딩된 raw 색상 없음.**

---

## Spacing

**Primitive** — 4px 그리드

| Token | Value |
|---|---|
| space-1 · 2 · 3 · 4 · 5 · 6 | 4 · 8 · 12 · 16 · 20 · 24px |

**Semantic** — 정의된 alias 없음.
**Direct CSS notes**: `1px`, `2px`, `3px`, `5px 10px`, `8px 12px`, `390px`, `720px`, `780px`는 `styles.css`에서 직접 사용되며 토큰이 아니다.

## Radius

**Primitive**

| Token | Value |
|---|---|
| radius-sm / md / lg / full | 8 / 12 / 16 / 999px |

**Semantic** — 정의된 alias 없음.
**Direct CSS notes**: `4px`(말풍선 뾰족 모서리), `20px`, `24px`, `28px`, `32px`, `38px`(폰 프레임) 등은 직접 사용값.

## Typography

**Body** — Pretendard Variable

| Token | Size | Weight | LineHeight | LetterSpacing |
|---|---|---|---|---|
| text-xs | 12px | 400 | 150% | 0px |
| text-sm | 14px | 400 | 150% | 0px |
| text-md | 16px | 400 | 150% | 0px |
| text-lg | 18px | 700 | 130% | 0px |
| text-xl | 24px | 700 | 130% | 0px |

**Source notes**: `--font-family`, `--leading-tight`, `--leading-base`, `--weight-regular/medium/semibold/bold`가 `tokens.css`에 존재한다. 위 스타일 행은 원 토큰명에서 `--`만 뗀 것.
**위계 규칙**: caption(12) < sub(14) < body(16) < title(18) < display(24). 라벨은 12px 허용, **문장형 텍스트는 14px 이상**(접근성).

## Effects

| Token | Type | Color | X | Y | Blur | Spread |
|---|---|---|---|---|---|---|
| shadow-card | drop-shadow | rgba(0,0,0,0.06) | 0 | 1px | 3px | 0 |
| shadow-sheet | drop-shadow | rgba(0,0,0,0.12) | 0 | -8px | 24px | 0 |
| shadow-banner | drop-shadow | rgba(0,0,0,0.16) | 0 | 4px | 16px | 0 |

**Direct CSS notes**: 폰 프레임 그림자, `filter: brightness(1.06)`, opacity, 시트 푸터 그라데이션은 직접 사용값(토큰 아님).

## Motion

`--ease-out` = `cubic-bezier(0.22, 1, 0.36, 1)` · `--duration-fast` = `150ms` · `--duration-base` = `250ms`
(MD→Figma 템플릿에 Motion 표가 없어 노트로 기록)

## Grid

정의된 grid 토큰 없음. `repeat(3, 1fr)`, `auto 1fr auto auto`, `max-width: 82%/92%`, `max-height: 86%` 등은 직접 사용값.

---

## 코드 ↔ Figma 동기화 메모

- **Light/Dark**: 위 Semantic 표는 코드 기준 스펙이다. 현재 Figma 배리어블은 대부분 Light=Dark 단일 모드로 생성돼 있고, 앱도 모드 전환 대신 `-dark` 접미 토큰을 명시적으로 참조한다. Figma에 실제 테마 모드를 도입할 때 이 표의 Dark 열이 그대로 매핑된다.
- **user/1~6**: 아바타 유저컬러는 **Primitive 전용**이며 Semantic 별칭이 없다. 컴포넌트는 컴포넌트 로컬 변수 `--avatar-bg`(토큰 아님)에 인덱스로 고른 primitive를 주입한다. `DESIGN-SYSTEM.md`에도 동일하게 반영됨.
- **컴포넌트 매핑**은 표로 쓰지 않는다. MD→Figma 플러그인이 템플릿 지원 섹션(토큰·스타일)만 파싱하도록 하기 위함. 컴포넌트 문서는 [`README.md`](./README.md) 참조.
