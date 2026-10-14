# Notice
> 버블/시트 안의 보조 안내줄. tone: neutral·weak·warn·danger·success.

**Tier** Atom · **Figma** `Common/Notice` · **Source** `src/components/primitives.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **톤으로 안내의 위계·성격을 분리**: 규칙(neutral), 부담 낮추는 말(weak), 경고(warn), 실패(danger), 완료(success).
- **weak = 배경 없이 본문 흐름에 녹임(패딩0·투명)**, 단 문장형 안내라 **14px(text-sm) 이상**으로 접근성 대비 확보 — "응답 안 해도 괜찮아요" 같은 문장을 카드처럼 튀지 않게.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `tone` | neutral·weak·warn·danger·success | `'neutral'` | 성격 |
| `children` | node | — | 문구(볼드 강조 가능) |

## 코드 (현재 구현)
```jsx
export function Notice({ tone = 'neutral', children }) {
  return <p className={`notice notice--${tone}`}>{children}</p>;
}
```
CSS: `.notice`(text-sm, line 1.5, radius-sm, pad 8/12) · `.notice--weak`(투명·pad0) · warn/danger/success

## 사용 예시
```jsx
<Notice tone="neutral">어려우면 <b>{deadline}</b>까지 알려주세요.</Notice>
<Notice tone="warn">확인 기한이 지나 필참자에게만 다시 알렸어요.</Notice>
```

## 토큰
`--color-surface-sub`, `--color-warn-weak/warn-text-strong`, `--color-danger(-weak)`, `--color-success(-weak)`, `--color-text-sub/weak`, `--radius-sm`, `--text-sm`

## Figma 매핑
`Common/Notice` base(neutral) + `styleNotice(tone)`(weak는 패딩0·투명) · TEXT prop **Text**

## Uses / Used by
- **Used by**: 버블 전반, [Sheet/Respond](../organisms/sheet-respond.md)
