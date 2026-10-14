# NameFlow
> "댄, 마라, 윌리엄님의 응답을 기다리고 있어요" — 이름을 볼드로 나열하는 현황판 문장 조각.

**Tier** Atom(텍스트 패턴) · **Figma** 별도 컴포넌트 아님(Board/Notice 내부 볼드 텍스트) · **Source** `src/components/primitives.jsx`

## 설계 의도 (왜 이렇게 만들었나)
- **명단을 '목록'이 아니라 '문장'으로**: 대기자/불참자를 자연어로 부드럽게 전달(딱딱한 리스트 회피). 이름만 볼드로 스캔 가능.
- React에서는 독립 컴포넌트지만 Figma에는 별도 component 정의 없이 Board/Notice의 볼드 텍스트로 표현한다.

## React API
| prop | type | 설명 |
|---|---|---|
| `ids` | string[] | 이름 낼 멤버 id 배열(빈 배열이면 null) |
| `suffix` | node | 뒤에 붙는 문구(예: "님의 확인이 꼭 필요해요") |

## 코드 (이관 전 서비스 발췌)
```jsx
export function NameFlow({ ids, suffix }) {
  if (!ids.length) return null;
  return <span className="nameflow">{ids.map((id,i)=>(<React.Fragment key={id}><b>{MEMBERS[id].name}</b>{i<ids.length-1?', ':''}</React.Fragment>))}{suffix}</span>;
}
```
CSS: `.nameflow b`(semibold)

현재 서비스는 패키지 NameFlow를 재export하여 사용한다. 패키지는 MembersProvider에서 멤버 이름을 읽으며 ids는 readonly 배열도 허용한다. 위 MEMBERS 직접 참조는 분리 전 방식이다. 빈 배열이면 null이며 배열 순서와 suffix를 그대로 사용한다.

## 사용 예시
```jsx
<NameFlow ids={waiting} suffix="님의 확인이 꼭 필요해요" />
```

## Uses / Used by
- **Used by**: Board(대기 현황), [ProposalBubble](../organisms/proposal-bubble.md), CoordinationBubble
