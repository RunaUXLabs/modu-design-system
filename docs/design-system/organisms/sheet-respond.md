# Sheet (Bottom Sheet)
> 버블/현황 탭 시 열리는 바텀 시트. 모드별로 Compose/Proposal/Response/Organizer 본문을 구성. grab + body + (필요 시) footer.

**Tier** Organism · **Figma** `ChatRoom/Sheet` (58:261) · **Source** `modu/src/components/Sheet.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **한 시트 틀에서 상황별 본문만 교체**: 여백 위계(필드 4 < 그룹 8~12 < 섹션 24)와 하단 고정 footer + 스크롤 포그로 "더 있다"를 암시. 라운드 코너를 스크롤바가 자르지 않게 body가 스크롤 담당.
- **`.phone`의 자식으로 렌더**해야 dim(`absolute; inset:0`)이 폰 안에 갇힘 — 폰 밖이면 body 스크롤이 번쩍임(중요 구조 규칙).
- 응답은 [SlotCard](../molecules/slot-card.md)(respond)+[SegButton](../atoms/seg-button.md), 생성은 [Field](../atoms/field.md), 주최자 현황은 [Matrix](../molecules/matrix-table.md).
- Field/MatrixTable/SectionTitle과 SlotCard/Button/Notice/Avatar는 공통 UI를 사용한다. 편집 상태·저장·집계 액션과 Sheet 자체는 서비스 소유이며 공개 패키지 API가 아니다.

## React 구현
```jsx
export default function Sheet() {
  if (!state.sheetOpen) return null;              // 닫힘 가드
  return (
    <div className="sheet__dim" onClick={close}>
      <div className="sheet" onClick={stop}>
        <div className="sheet__grab" />
        {/* mode별: ComposeSheet / ProposalSheet / ResponseSheet / OrganizerSheet */}
      </div>
    </div>
  );
}
```
CSS: `.sheet__dim/grab/body/footer/section/sectiontitle/title/escalation`

## Figma 매핑
2026-10-14 확인: `ChatRoom/Sheet` · SLOT **body/Slot_Fixed/footer**. Respond는 시트의 조합 예시이며 독립 set 정의라고 단정하지 않는다. React의 상태별 본문 교체와 footer 조건은 서비스 Sheet가 소유한다.

## Uses / Used by
- **React Uses**: [SlotCard](../molecules/slot-card.md)(respond/hero), [Button](../atoms/button.md), Avatar/Chip/Notice, SectionTitle/Field/MatrixTable. SegButton은 SlotCard 내부 사용. Field의 편집 UI는 서비스가 children으로 전달한다.
- **Used by**: App / [Shell/Phone](./shell-phone.md) 내부 오버레이
