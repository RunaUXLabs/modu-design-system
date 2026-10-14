# Matrix/Row
> 현황표의 한 줄 — 이름 블록(아바타 sm + 역할 배지 + 이름) + 슬롯별 Cell.

**Tier** Molecule · **Figma** `Matrix/Row` (58:194) · **서비스** 공통 MatrixTable에서 조립 · **패키지** `src/components/molecules/MatrixRow.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- 멤버 행을 **좌측 이름 열(고정) + 우측 상태 셀**로 — 넘칠 땐 이름 열 sticky. 역할(필/선)은 칩 대신 **얇은 원형 배지**로 행 두께 최소화(정보 밀도).

## React 구현
```jsx
<div className="matrix__row">
  <span className="matrix__name"><Avatar id={id} size="sm" /><span className="matrix__nametext">{name}<i className={`matrix__role ${req?'matrix__role--req':''}`}>{req?'필':'선'}</i></span></span>
  {/* 슬롯별 응답을 읽어 가능/어려움/미응답 표식을 표시한다. */}
</div>
```
CSS: `.matrix__row/name/nametext/role(--req)`

## 패키지 React API

id와 slots가 필수다. MembersProvider의 멤버를 읽고, responses는 슬롯 id별 ok/hard 값이며 기본값은 빈 객체다. required를 생략하면 멤버 required, 없으면 false다. absent 기본값은 false다.

ok는 ✓, hard는 ✕, 미응답은 –로 표시한다. absent의 '불참' 표시는 미응답 셀에만 적용하며 기존 응답을 덮지 않는다. 역할 표식은 Chip이 아닌 matrix__role이다. 이름 열 sticky/100px 및 셀 min-width 56px은 matrix--table 부모에서 적용된다.

## Figma 매핑
2026-10-14 확인: TEXT **Name**, SLOT **Slot__TimeStatus/Slot__Status**. 내부 Avatar/Cell 조립과 SLOT 속성을 구분한다.

## Uses / Used by
- **Uses**: [Avatar](../atoms/avatar.md)(sm), [Matrix/Cell](../atoms/matrix-cell.md)
- **Used by**: [Matrix/Table](./matrix-table.md)
