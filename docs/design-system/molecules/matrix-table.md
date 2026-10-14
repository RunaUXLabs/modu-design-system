# Matrix/Table
> 주최자 응답 현황표 — 헤더행(슬롯 라벨) + 멤버행(Matrix/Row). 폰 폭 안 컴팩트.

**Tier** Molecule · **Figma** Matrix 행 조합 · **서비스** `src/features/scheduling/components/Sheet.jsx` · **패키지** `src/components/molecules/MatrixTable.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- 주최자에게 **누가·어떤 슬롯에 가능/어려움**인지를 한 화면에. 이름 열은 100px, 셀은 flex:1/min-width:56px로 구성한다. 내용이 넘치면 가로 스크롤과 이름 열 sticky를 사용한다. 모든 폭에서 스크롤이 없다고 보장하지 않는다.

## React 구현
- `.matrix` grid에 헤더행 + `.matrix__row` 반복(멤버×슬롯).

## 패키지 React API

slots와 memberIds는 필수이며 제공된 배열 순서를 유지한다. 각 슬롯 id로 응답을 연결한다. responses는 멤버 id → 슬롯별 ok/hard 값이다. requiredIds를 생략하면 멤버 메타를 사용하고, 빈 배열이면 전원을 선택 참석으로 표시한다. outMembers의 불참은 미응답 셀에만 적용한다. 기본 응답은 빈 객체, 기본 outMembers는 빈 배열이다.

표는 집계·일정 확정이나 재요청 버튼을 소유하지 않는다. 현재 서비스 OrganizerSheet는 공통 MatrixTable을 사용하고 서비스 처리 UI와 액션을 별도로 조합한다. 예제 스냅샷은 `examples/service/features/scheduling/components/Sheet.jsx`에서 확인한다.

## Figma 매핑
2026-10-14 Component 페이지에서 `Matrix/Table`이라는 독립 component/set 정의는 확인되지 않았다. 확인된 `Matrix/Row`와 헤더/행 조합을 표현하는 설명 이름이다. 이를 Figma 공개 컴포넌트 명칭으로 단정하지 않는다.

## Uses / Used by
- **Uses**: [Matrix/Row](./matrix-row.md)
- **Used by**: [Sheet](../organisms/sheet-respond.md)(주최자 현황/에스컬레이션)
