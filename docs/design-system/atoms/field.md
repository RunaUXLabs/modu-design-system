# Field
> 회의 생성 폼의 한 행 — 라벨 + 값 박스(클릭형) + source 힌트.

**Tier** Atom · **Figma** `Common/Field` (56:161) · **서비스** `src/features/scheduling/components/Sheet.jsx` · **패키지** `src/components/atoms/Field.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- **값이 '입력값'이 아니라 '제안값'임을 드러냄**: 캘린더/조건 기반으로 시스템이 미리 채운 값을 클릭형 박스 + `source`("캘린더 기준 제안 — 눌러서 바꿀 수 있어요")로 표시. 확정이 아니라 확인·수정 대상임을 UI로.
- 서비스의 출처는 `f.source`로 표시한다. 패키지에는 showSource가 있지만 Figma에 같은 이름의 BOOLEAN 속성은 없다. 코드 API와 디자인 속성을 구분한다.

## React 구현
- 서비스 ComposeSheet는 공통 Field를 사용한다. onClick으로 editing을 바꾸고 children에 input/options를 전달한다. text는 Enter/onBlur, 선택형은 Button으로 patch한다.
- Field는 표시와 클릭 callback 및 children 슬롯을 제공한다. 자체 편집 상태·저장 로직은 없다. 편집 표식은 고정되어 있다.
```jsx
<div className="field">
  <div className="field__row"><span className="field__label">제목</span>
    <button type="button" className="field__value" onClick={openEditor}>우리팀 회의 <span className="field__editicon">✎</span></button></div>
  <span className="field__source">캘린더 기준 제안 — 눌러서 바꿀 수 있어요</span>
</div>
```
CSS: `.field` · `.field__row/label/value/editicon/source/input/options`

위는 표시 구조의 설명용 발췌다. 현재 서비스는 이 마크업을 복제하지 않고 Field 인스턴스에 편집 UI를 children으로 전달한다.

## 패키지 React API

| prop | type | default | 설명 |
| --- | --- | --- | --- |
| label | string | 필수 | 라벨 및 버튼 aria-label |
| value | ReactNode | 필수 | 제안값 |
| source | ReactNode | 미지정 | 출처 |
| showSource | boolean | true | source가 있을 때 표시 여부 |
| onClick | button 클릭 handler | 미지정 | 소비 앱의 편집 진입 연결 |
| ariaLabel | string | label | 값 버튼의 접근 가능한 이름 |
| children | ReactNode | 미지정 | 소비 앱이 렌더링하는 편집 UI 슬롯 |

Edit prop은 없다. children 슬롯은 편집 UI를 받을 수 있지만 편집 상태·저장을 소유하지 않는다. 전체 편집 흐름은 Service Screens의 실제 Sheet 예제에서 확인한다.

## 토큰
`--color-surface-sub/line/primary`, `--color-text/text-sub/text-weak`, `--radius-sm`, `--text-md/sm/xs`, `--weight-medium/semibold`

## Figma 매핑
2026-10-14 확인: TEXT **Label/Source**, BOOLEAN **Edit**, SLOT **Slot__Edit**. 기존 TEXT Value/BOOLEAN Show source 설명은 정정한다. 슬롯 콘텐츠로 값/편집 표현을 조합한다. Figma Common/TextInput은 있으나 패키지에는 공개하지 않았고 서비스는 native input을 사용한다.

## Uses / Used by
- **Used by**: [Sheet](../organisms/sheet-respond.md)(Compose 섹션)
