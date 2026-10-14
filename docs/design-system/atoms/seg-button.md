# SegButton
> 슬롯 응답용 [가능 / 어려움] 이분 토글. 응답 시트·SlotCard(respond) 공용.

**Tier** Atom · **Figma** `Common/SegButton` · **Source** `src/components/primitives.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **이분 응답을 한 번의 탭으로** — 별도 라디오/드롭다운 없이. 선택된 쪽만 색(가능=success, 어려움=danger)으로 채워 '내 응답'을 명확히.
- **base+override**: 선택 상태를 variant로 굽지 않고 `styleSeg('none/ok/hard')`로 해당 아이템만 오버라이드.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `value` | `'ok'`\|`'hard'`\|undefined | — | 현재 응답 |
| `onChange` | fn(v) | — | 변경 콜백 |
| `disabled` | boolean | — | 비활성(opacity 0.5) |

## 코드 (이관 전 서비스 구조 발췌)
```jsx
export function SegButton({ value, onChange, disabled }) {
  return (
    <div className={`seg ${disabled ? 'seg--disabled' : ''}`} role="radiogroup">
      <button className={`seg__item ${value==='ok'?'seg__item--ok':''}`} onClick={()=>!disabled&&onChange('ok')}>가능</button>
      <button className={`seg__item ${value==='hard'?'seg__item--hard':''}`} onClick={()=>!disabled&&onChange('hard')}>어려움</button>
    </div>
  );
}
```
CSS: `.seg`(surface·보더·radius-sm·overflow hidden) · `.seg__item` · `--ok/--hard` · `.seg--disabled`

현재 패키지 `src/components/atoms/SegButton.tsx`는 controlled API를 유지하면서 radio/aria-checked, native disabled, roving tabindex를 보완했다. 화살표는 두 선택지를 전환하며 Home=가능, End=어려움으로 focus와 callback을 이동한다. 부모가 value를 갱신해야 선택 표시가 변경된다. aria-label 기본값은 '참석 가능 여부'다. 이는 패키지 접근성 보완이며 이관 전 서비스 발췌에 이미 구현되어 있다는 뜻이 아니다.

## 사용 예시
```jsx
<SegButton value={myValue} onChange={setMyValue} />
```

## 토큰
`--color-surface/line`, `--color-success(-weak)/danger(-weak)`, `--color-text-weak`, `--radius-sm`, `--text-sm`, `--weight-medium/semibold`

## Figma 매핑
`Common/SegButton` base(미선택) + `styleSeg('none|ok|hard', disabled)`

## Uses / Used by
- **Used by**: [SlotCard](../molecules/slot-card.md)(respond), [Sheet/Respond](../organisms/sheet-respond.md)
