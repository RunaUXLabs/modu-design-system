# 서비스 코드 SSOT 기준 점검

## 최신 동기화 정정 (2026-10-14)

아래 내용은 최초 분리 당시의 점검 이력이다. 이후 서비스가 내부 모듈로 통합되면서 Button danger 정의가 제거됐고, Field에 ariaLabel/children이 추가됐으며 Board·MatrixTable·SectionTitle도 공통 UI로 사용한다. 이 독립 저장소는 해당 최신본을 반영했다. 현재 계약은 [패키지 API](package-api.md), 원본 대응과 검증은 [동기화 기록](synchronization.md)을 기준으로 한다. 아래 과거의 미사용·형제 저장소 의존 설명을 현재 상태로 해석하지 않는다.

검토일: 2026-10-14. 대상: modu 서비스, modu-design-system 패키지/Storybook, Figma Component 페이지 0:1.

이 문서는 최초 점검 당시 발견 사항과 후속 처리 기록을 함께 보존한다. 아래 가이드라인 줄 번호는 정정 전 스냅샷 기준이며 수정 후에는 달라질 수 있다.

기준 우선순위는 서비스 코드 > Figma 표현 > 기존 설명 문서다. 현재 서비스가 이미 패키지를 import하므로 순환 검증을 피하기 위해 서비스 Git HEAD의 분리 전 구현도 비교했다. HEAD의 원본은 개발자가 만든 최초 버전임을 증명하는 자료가 아니라 패키지화 전 코드 기준선이다.

Figma: https://www.figma.com/design/ADGZA9in8smWNHWctdr4ao/?node-id=0-1

## 핵심 결론

- 현재 서비스와 분리 전 서비스에 Button danger 사용처는 확인되지 않았다. 동적 variant 선택도 primary/secondary다.
- 원본 primitives.jsx의 Button 설명과 원본 styles.css의 .btn--danger, 기존 Button 문서에는 danger가 이미 존재한다. 패키지화 과정에서 새로 만든 variant는 아니다.
- Figma Common/Button(51:149)의 variant는 Size=md/sm뿐이다. Slot__md, Slot__sm 콘텐츠 슬롯을 사용하고 색상/opacity는 인스턴스에서 덮어쓴다. Danger라는 독립 variant는 없다.
- Component 페이지의 Common/Button 이름 인스턴스 74개를 조회했을 때 danger-weak 배경(#fdedee)은 없었다. 다른 페이지/다른 이름 인스턴스/과거 파일까지 미사용을 확정하는 전수 검사는 아니다.
- Storybook의 Danger 라벨 '참석 제외'는 실제 서비스 callsite에서 가져온 사용 예제가 아니다. API 상태 시연을 실제 서비스 사례와 구분하지 않은 문제가 있다.

## 우선 수정 검토

### 1. Storybook 사용 사례와 지원 API 구분

위치: stories/atoms/Button.stories.tsx:20.

현재 Danger는 구현에 존재하지만 서비스에서 쓰지 않는 상태다. '참석 제외' 문구는 이번 Storybook 작성 시 선택한 예제 문구이며 실제 UX 대응을 증명하지 않는다. API 지원 여부와 실제 서비스 사용 여부를 따로 표시해야 한다. 서비스 사용 상태만 전시하려면 Danger 대표 예제를 제외하거나 별도 '기존 정의/미사용' 예제로 분리한다. API 제거는 별도 결정이며 자동으로 수행하지 않는다.

### 2. Button 문서의 Figma 계약이 현재 구조와 다름

위치: docs/design-system/atoms/button.md:49, src/components/atoms/Button.tsx:4.

문서는 Figma TEXT prop Label을 설명하지만 현재 정의에는 Size 및 두 SLOT 속성이 있다. React children은 슬롯 콘텐츠를 전달하는 합성 수단이므로 slots 수와 props 수를 1:1로 맞출 필요는 없다. 현재 API에 자유로운 style/className/children 전달이 가능하다는 점도 Figma의 색 오버라이드/콘텐츠 삽입과 별도로 설명해야 한다. 새 tone/color variant를 만들어 조합을 늘릴 근거는 없다.

### 3. 버튼 글자 굵기 불일치: Figma가 서비스와 다름

Figma 기본 md/sm 텍스트는 Pretendard Variable Bold 700이다. 원본 서비스와 패키지 .btn는 weight-semibold 600이다(src/styles.css:429). 패키지 회귀가 아니라 기존 Figma·코드 간 차이다. 패딩 md=12/16, sm=8/12, 크기 16/14, radius 12/8은 일치한다. Figma AUTO line-height와 서비스 브라우저 normal도 폰트 로딩 후 실측 비교가 필요하다. 코드 SSOT라면 Figma 쪽 600 정렬을 검토한다.

### 4. JudgeBar 버튼 통합 설명이 서비스와 다름

Button 가이드에는 advance/reset을 단일 Button으로 통합했다고 되어 있다. 현재 및 분리 전 서비스 JudgeBar는 judge__advance와 judge__reset의 별도 native button이다(modu/src/components/JudgeBar.jsx:37, :45). Figma는 이 버튼들을 Common/Button 인스턴스로 표현한다(34:108, 34:110). 디자인 재사용과 React 컴포넌트 재사용을 같은 사실로 기록하면 안 된다. 현재 코드 기준으로 문서 정정 또는 후속 코드 통합을 별도 결정해야 한다.

## 기타 구조 차이

| 항목 | Figma | 서비스/패키지 | 판단 |
| --- | --- | --- | --- |
| Avatar | md/sm/sm_list | md/sm | 확인한 sm_list와 sm은 28px 및 12px 텍스트/600으로 동일. 새 variant 추가 근거 없음 |
| Chip | md와 20x20 sm | Chip은 한 크기, Matrix 필/선은 별도 matrix__role | 작은 배지는 서비스에서 이미 다른 요소로 구현. 패키지 Chip 누락으로 단정하지 않음 |
| Field | Slot__Edit, Edit boolean, TextInput 구성 | Field value와 고정 편집 표식. 실제 편집 input/options는 서비스 Sheet에 유지 | Storybook은 표시 상태만 보여줌. 편집 전체를 패키지화했다는 설명은 부정확. 합성 예제 필요 여부 검토 |
| BubbleShell | 여러 목적별 SLOT | children | React 합성으로 표현 가능. 슬롯 수만큼 props나 variants를 늘릴 필요 없음 |
| SlotCard | hero/tally/respond 외 escalation 자식 | 공개 SlotCard 3종, escalation은 서비스 sheet__escalation | 코드 기준으로 서비스 전용 경계가 타당. escalation을 패키지 variant로 추가할 근거 없음 |

SlotCard set(52:165)의 componentPropertyDefinitions 조회는 'Component set has existing errors'로 실패했다. 자식에는 Variant=hero/tally/respond와 축 형식이 다른 이름 escalation(133:1993)이 보인다. 속성 축 불일치가 원인일 가능성은 있지만 조회 오류만으로 원인을 확정하지 않는다. Figma 편집기에서 set 오류를 확인해야 한다.

## 보존 확인

- src/tokens/tokens.css와 서비스 HEAD:src/tokens.css를 줄바꿈 정규화 후 비교하여 값 및 본문 일치 확인.
- PostCSS 파서로 패키지의 기존 서비스 selector 113개 규칙을 원본 규칙들과 비교하여 선언 일치 확인. 같은 selector의 여러 규칙은 각각 비교했다.
- 추가된 패키지 scoped reset 및 브라우저 최종 cascade/실측은 위 선언 비교로 검증되지 않는다.
- Button의 표준 HTML 속성 확장은 패키지 API 보완이며 시각 variant 추가가 아니다.
- SegButton의 radio 의미/키보드, Provider 데이터 주입 등은 기존 서비스의 시각 규칙과 분리하여 API/접근성 보완으로 기록해야 한다.

## 후속 순서

1. Storybook에 서비스 사용 예제와 기존 미사용 API 예제를 구분한다.
2. Button 슬롯 매핑, JudgeBar native button, Field 편집 경계를 문서에 정정한다.
3. Figma Button 글자 굵기 및 SlotCard set 오류를 코드 SSOT 기준으로 검토한다.
4. 슬롯 조합 예제를 서비스 실제 callsite에서 추출한다. 임의의 비즈니스 문구/variant를 추가하지 않는다.
5. 폰트 로딩을 맞춘 서비스/Storybook/Figma 대표 상태를 브라우저 실측 및 캡처로 비교한다.

최초 점검에서는 구현 API, 서비스 코드, Storybook 예제 및 Figma 디자인을 수정하지 않았다. 모든 컴포넌트/모든 화면의 픽셀 단위 일치나 상호작용 전수 검증을 완료한 것은 아니다.

## 문서 정정 처리 (2026-10-14)

사용자 승인에 따라 Markdown을 서비스 코드 SSOT 기준으로 정정했다.

- 문서 README/작성 템플릿/package-api/implementation-plan/패키지 README에 기준과 출처 범위를 명시했다.
- Button의 danger 미사용, disabled 차이, 실제 사용 예제, 콘텐츠 SLOT, 글자 굵기 차이 및 JudgeBar의 별도 native button을 명시했다.
- Avatar의 Figma 크기/Dimmed/색 경로 설명, Chip의 sm과 matrix__role 구분을 정정했다.
- Field/Board/Matrix의 서비스 인라인 기능과 패키지 공개 API를 구분했다.
- BubbleShell/SlotCard/Matrix/Sheet/Phone/ChatChrome의 확인된 SLOT 매핑과 미확인 속성을 정정했다.
- MembersProvider 이후 NameFlow/MessageRow/MemberCard 계약과 SegButton의 접근성 보완을 구분했다.
- ProposalBubble의 store 사용을 일반 props 금지 규칙으로 설명하지 않도록 정정했다. ConfirmedBubble의 예약/등록 문구는 외부 API 연동 증빙이 아님을 명시했다.
- Storybook/이력용 문서에도 실제 사용 사례와 API 시연, 확인된 검증 범위를 구분했다.

구현 API, 서비스 코드, Storybook story 및 Figma 디자인은 변경하지 않았다. 남은 작업은 미사용 story의 분리, Figma 600 굵기 정렬 검토/SlotCard set 오류 확인 및 폰트 조건을 맞춘 브라우저 비교다. 기계 판독용 DESIGN-SYSTEM.md와 토큰 값은 유지했다.

## 후속 Storybook 확장

사용자 승인 후 Button danger를 API Reference로 분리하고 임의 '참석 제외' 라벨을 제거했다. Patterns와 Service Screens에는 실제 서비스의 버블/ChatRoom/Sheet/JudgeBar/StoreProvider를 재사용했다. 기존 서비스 액션으로 대표 상태를 준비하며 화면 마크업이나 reducer를 복제하지 않는다. 추가 공개 컴포넌트/variant는 없으며 서비스 파일과 Figma도 변경하지 않았다.

Vite preview alias/scoped CSS, 시작 상태별 remount, 서비스 전용 테스트와 Docs 검토 안내를 추가했다. 테스트/타입/빌드 결과는 Storybook 가이드의 확장 검증 기록에 별도로 남긴다. Figma 글자 굵기 및 set 오류, 폰트 조건을 맞춘 픽셀 비교는 여전히 후속 범위다.
