# modu · 디자인 시스템 문서

컴포넌트는 **아톰 → 분자 → 유기체**로 조립되며 커진다. 각 문서는 **정의 → 설계 의도(왜) → React API/구현 → 사용(Do/Don't) → 토큰 → Figma 매핑 → Uses/Used by** 순.
새 컴포넌트는 [`_template.md`](./_template.md) 복사.

- 패키지 소스 규칙: 컴포넌트 1개 = 파일 1개. tier는 폴더/섹션으로만(이름엔 안 붙임). 서비스의 인라인 마크업까지 분리됐다는 뜻은 아니다.

## 기준과 확인 범위

**SSOT는 실제 modu 서비스 코드다.** 문서는 코드에 근거한 설명이며, 문서나 Figma가 코드와 다르면 차이를 기록하고 서비스 기준으로 정정한다. 문서만 보고 새 variant나 사용 규칙을 추가하지 않는다.

- 서비스 사용 여부는 `src/features`와 `src/pages`의 실제 import, JSX 및 상태 분기에서 확인한다.
- 서비스 내부 모듈은 `src/design-system`, 이 독립 저장소의 공개 API는 `src/index.ts`와 각 타입에서 확인한다. 서비스 화면 스냅샷은 `examples/service`에 있다.
- 서비스가 이미 패키지를 import하는 항목은 분리 전 서비스 Git 코드와도 비교해 순환 검증을 피한다.
- Figma SLOT과 React children/props의 개수는 일대일 대응하지 않아도 된다.
- Source 경로는 별도 표기가 없으면 `modu` 기준이다. 생략 부호가 있는 코드는 구조 설명용이다. MEMBERS 직접 참조 발췌는 이관 전 서비스 구현이며 현재 패키지는 MembersProvider를 사용한다.
- [2026-10-14 점검 기록](../ssot-audit.md)은 확인한 차이와 미검증 범위를 남긴다. 전체 화면의 픽셀 일치 검증을 완료한 것은 아니다.

## 문서 구성 — 두 트랙

| 트랙 | 파일 | 성격 |
|---|---|---|
| **기계 판독 스펙** | [`DESIGN-SYSTEM.md`](../../DESIGN-SYSTEM.md) (루트) | 자사 **md-to-figma** 플러그인이 파싱 → Figma 배리어블·스타일 생성. 이식하면 그대로 반영. **템플릿 규약 유지 필수** |
| **사람용 해설** | [`foundation-guide.md`](./foundation-guide.md) | 토큰 2계층 구조·CSS↔Figma 매핑 규칙·용도/대비율·동기화 메모 |
| **사람용 해설** | `atoms/` `molecules/` `organisms/` | 컴포넌트별 정의·설계 의도·API·Figma 매핑 |

이 저장소의 토큰 정본은 `src/tokens/tokens.css`다(서비스 원본: `src/design-system/tokens/tokens.css`). 해설 문서와 `DESIGN-SYSTEM.md`의 표는 미러이며 불일치 시 CSS 정본을 우선한다. [동기화 경로](../synchronization.md)를 참조한다.

패키지 이관 이후의 React API 및 기존 앱 소스와의 대응은 [패키지 API](../package-api.md)를 참조한다. 과거 구현 발췌와 현재 계약을 구분한다. 라이브러리의 실제 소스는 `src/components/atoms`와 `src/components/molecules`다. 구현에 존재하는 상태가 서비스에서 실제 사용된다는 뜻은 아니다.

## 설계 원칙
- **base + 인스턴스 오버라이드** — Figma의 색/톤 변경은 인스턴스에서, 코드는 확인된 props/CSS로 표현한다. `styleX`라는 설명 이름만으로 실제 유틸이 존재한다고 가정하지 않는다.
- **Button**의 Figma variant는 Size(md/sm), 콘텐츠는 SLOT이다. Avatar의 Figma에는 md/sm/sm_list가 있지만 서비스 API는 md/sm이다. 색=semantic 변수, 유저색은 `--user-N` round-robin.
- **프로퍼티**: TEXT·BOOLEAN·SLOT·INSTANCE_SWAP은 서로 다른 타입이다. 확인한 정의만 기록하며 SLOT을 INSTANCE_SWAP으로 표기하지 않는다.
- **인스턴스 재활용**: 상위는 하위 원자를 인스턴스로 조립(재생성 금지).

## 컴포넌트 트리

### Atoms
- [Avatar](./atoms/avatar.md) · [Button](./atoms/button.md) · [Chip](./atoms/chip.md) · [Notice](./atoms/notice.md) · [SegButton](./atoms/seg-button.md) · [NameFlow](./atoms/name-flow.md) · [Field](./atoms/field.md) · [SectionTitle](./atoms/section-title.md) · [Icons](./atoms/icons.md)
- [StagePill](./atoms/stage-pill.md) · [Label](./atoms/label.md) · [DateDivider](./atoms/date-divider.md) · [MessageBubble](./atoms/message-bubble.md) · [Board](./atoms/board.md) · [Matrix/Cell](./atoms/matrix-cell.md)

### Molecules
- [MemberCard](./molecules/member-card.md) · [StageTrack](./molecules/stage-track.md) · [MessageRow](./molecules/message-row.md) · [BubbleShell](./molecules/bubble-shell.md) · [SlotCard](./molecules/slot-card.md) · [Matrix/Row](./molecules/matrix-row.md) · [Matrix/Table](./molecules/matrix-table.md)

### Organisms
- [JudgeBar](./organisms/judgebar.md)
- Bubbles: [Compose](./organisms/compose-card.md) · [Proposal](./organisms/proposal-bubble.md) · [Coordination](./organisms/coordination-bubble.md) · [Confirmed](./organisms/confirmed-bubble.md) · [NoSlot](./organisms/noslot-bubble.md)
- [Sheet](./organisms/sheet-respond.md) · [Shell/Phone](./organisms/shell-phone.md) · [Shell/ChatChrome](./organisms/shell-chatchrome.md)

## 상태
- 컴포넌트별 문서가 존재한다. 2026-10-14 서비스 SSOT 기준으로 확인된 오류를 정정했으며 전체 시각·동작 검증 완료를 의미하지 않는다.
- 유지: 코드/Figma 변경 시 해당 문서만 갱신. 조립 관계는 각 문서의 **Uses / Used by**로 추적.
