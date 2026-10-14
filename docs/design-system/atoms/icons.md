# Icons (Settings · Back · Send · Pin)
> 셸에 쓰이는 라인 아이콘. `currentColor` 벡터라 CSS/토큰 색을 그대로 따른다.

**Tier** Atom · **Figma** `Icon/Settings` `Icon/Back` `Icon/Send` (Pin은 인라인) · **Source** `src/components/primitives.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **글리프(⚙ ➤ ‹) 대신 벡터 아이콘**: 렌더 일관성·정렬·크기 제어. Feather 계열로 통일(톱니가 Feather라 back=chevron-left, send=paper-plane로 맞춤).
- **`stroke="currentColor"`**: 색을 아이콘에 박지 않고 부모 색(CSS/토큰)이 제어 → 헤더 text-sub, 보내기 text-weak 등 맥락색 그대로.

## React API
- props 없음. `IconSettings` / `IconBack` / `IconSend` / `IconPin`. 크기는 `width/height`, 색은 부모 `color`.

## 코드 (현재 구현)
```jsx
export function IconBack() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" /></svg>);
}
// IconSettings(톱니, 실제 SVG) · IconSend(paper-plane) · IconPin(14px)
```
> ⚠ JSX에선 속성이 **camelCase**(`strokeWidth`, `strokeLinecap`, `strokeLinejoin`). kebab-case면 React 경고.

## Figma 매핑
`Icon/Settings·Back·Send` — 24×24, `figma.createNodeFromSvg`로 벡터화, stroke = `semantic/text/sub` 변수(인스턴스에서 색 오버라이드)

## Uses / Used by
- **Used by**: [Shell/ChatChrome](../organisms/shell-chatchrome.md)(header·input·pinbar)
