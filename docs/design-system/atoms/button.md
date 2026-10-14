# Button
> 서비스 버블·시트에서 사용하는 액션 버튼. 기존 의미별 CSS, 크기, 폭, disabled를 조합한다.

**Tier** Atom · **Figma** `Common/Button` (51:149) · **서비스** `modu/src/components/primitives.jsx` 재export · **패키지** `src/components/atoms/Button.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- 서비스에서 primary/secondary/ghost를 사용한다. 동적 variant 선택도 primary/secondary다.
- **JudgeBar는 별도 native button**: advance/reset은 judge__advance/judge__reset CSS를 사용한다. Figma의 Common/Button 재사용과 React 사용처를 구분한다.
- **Figma는 Size와 콘텐츠 SLOT**: 색/opacity는 인스턴스 오버라이드, React 콘텐츠는 children으로 전달한다. 슬롯별 새 variant를 만들지 않는다.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `variant` | `'primary'`\|`'secondary'`\|`'ghost'` | `'primary'` | 서비스에서 사용하는 액션 형태 |
| `size` | `'md'`\|`'sm'` | `'md'` | md=12/16·text-md, sm=8/12·text-sm |
| `full` | boolean | `false` | 폭 100% |
| `disabled` | boolean | — | native disabled. primary opacity 0.35, secondary 0.4 |
| `onClick` | fn | — | 클릭 |
| `children` | ReactNode | — | 콘텐츠 슬롯. 텍스트만 받는 API가 아님 |
| `type` | button/submit/reset | button | 패키지의 표준 HTML 속성 지원 |
| `className`, `style` 등 | ButtonHTMLAttributes | — | 패키지에서 전달 가능. 임의 스타일을 서비스에서 검증된 variant로 간주하지 않음 |

ghost에는 전용 disabled opacity CSS가 없다. native 클릭 차단과 동일한 시각 처리는 별개다. 글자 굵기는 서비스와 패키지 모두 weight-semibold(600)이다.

## 코드 (현재 패키지 구현)
```tsx
export function Button({ variant = 'primary', size = 'md', full = false,
  type = 'button', className = '', ...props }: ButtonProps) {
  return <button {...props} type={type}
    className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`} />;
}
```
관련 CSS: `.btn` · `.btn--primary/secondary/ghost` · `.btn--md/sm` · `.btn--full` · `:disabled`(opacity)

## 사용 예시
```jsx
<Button variant="primary" full onClick={openSheet}>확인하기</Button>
<Button variant="secondary" size="sm" onClick={edit}>내 응답 수정하기</Button>
<Button variant="ghost" full onClick={sendWithoutReason}>사유 없이 보내기</Button>
```
- 위 예제는 bubbles.jsx의 확인/응답 수정 진입과 Sheet.jsx의 사유 생략 액션에 대응하며 callback 이름은 설명용이다.
- 서비스에서 확인한 variant·크기를 사용한다.

## 토큰
`--color-primary`, `--color-primary-weak`, `--color-text-inverse`/`--color-text-sub`, `--radius-md`/`--radius-sm`, `--text-md`/`--text-sm`, `--weight-semibold`

## Figma 매핑
- 2026-10-14 확인: Variant **Size(md/sm)**, SLOT **Slot__md/Slot__sm**. 별도 Danger variant 및 TEXT Label 속성 없음.
- 색/opacity는 인스턴스 오버라이드. 확인한 Component 페이지 Common/Button 이름 인스턴스에는 danger-weak 배경 사용이 없었다.
- 기본 텍스트는 Figma 700, 코드 600으로 다르다. 패딩·텍스트 크기·radius는 일치한다. 서비스 SSOT 기준 정렬 대상이며 디자인은 아직 수정하지 않았다.
- `styleButton`은 과거 문서의 매핑 설명 이름이다. 해당 유틸의 존재나 현재 호출을 확인한 것이 아니다.

## Uses / Used by
- **Uses**: —
- **React Used by**: [ProposalBubble](../organisms/proposal-bubble.md) 등 버블 전반, [Sheet](../organisms/sheet-respond.md).
- **Figma Used by**: 위 디자인 조합 및 [JudgeBar](../organisms/judgebar.md). 서비스 JudgeBar의 버튼은 native 구현이다.
