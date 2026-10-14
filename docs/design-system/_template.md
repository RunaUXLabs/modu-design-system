# <ComponentName>
> 한 줄 정의(무엇을, 왜).

**Tier** Atom|Molecule|Organism · **Figma** `<Figma/이름>` · **Source** `src/components/<file>.jsx`

## 근거와 범위
- SSOT: 서비스의 실제 소스 경로와 사용 callsite. 패키지와 서비스 경로를 구분한다.
- 서비스 사용 상태와 API에만 존재하는 미사용 상태를 따로 기록한다.
- 이관 전 발췌, 구조 예시, 현재 패키지 구현을 제목으로 구분한다.
- 실제 코드에서 확인할 수 없는 설계 이유는 의도/추정으로 표시하고 구현 사실로 단정하지 않는다.

## 언제 쓰나 / 쓰지 않나
- 쓴다: …
- 안 쓴다: … (대체 컴포넌트: …)

## 설계 의도 (왜 이렇게 만들었나)
- 근거 1 (어떤 문제/원칙 때문에 이 형태인지)
- 트레이드오프: … / 대안을 버린 이유: …

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| … | … | … | … |

## 코드 (현재 구현)
```jsx
// 실제 소스 발췌
```
관련 CSS: `.class1` · `.class2` (styles.css)

## 사용 예시
```jsx
<Component ... />
```
- ✅ Do: …
- ❌ Don't: …

## 토큰
`--token-a`, `--token-b` …

## Figma 매핑
- 컴포넌트 `<Figma/이름>` · Variant/프로퍼티 …
- 확인 날짜와 node id, 실제 속성 타입(TEXT/BOOLEAN/SLOT/INSTANCE_SWAP)을 기록한다.
- 인스턴스 색/콘텐츠 오버라이드와 코드 props를 대응시킨다. 확인하지 않은 styleX 유틸을 구현된 것으로 기재하지 않는다.
- Figma와 서비스 차이 및 미확인 항목을 별도로 적는다.

## Uses / Used by
- **Uses**: 실제 하위 컴포넌트 문서 링크를 삽입한다. 예시 경로를 그대로 남기지 않는다.
- **Used by**: 실제 서비스 callsite와 상위 문서 링크를 삽입한다. Figma 사용처는 별도로 기록한다.
