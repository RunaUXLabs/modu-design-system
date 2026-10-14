# Avatar
> 멤버를 나타내는 원형 이니셜 배지. 색은 멤버 인덱스 기반 6색 round-robin으로 자동 배정(정체성 ≠ 색).

**Tier** Atom · **Figma** `JudgeBar/Avatar` · **Source** `src/components/primitives.jsx`

## 언제 쓰나 / 쓰지 않나
- 쓴다: 채팅 메시지, 현황판, 확정 요약, 주최자 매트릭스, 심사바 등 멤버 식별이 필요한 모든 곳.
- 안 쓴다: 임의 이미지/아이콘. (아바타는 이니셜+유저색 전용)

## 설계 의도 (왜 이렇게 만들었나)
- **색을 멤버에 하드코딩하지 않고 인덱스 round-robin**: 정체성(누구)과 색(표시)을 분리 → 팀원이 6명을 넘어도 `--user-N`이 순환 재사용돼 확장 가능하고, 팔레트만 바꾸면 전 화면 일괄 반영.
- **색은 fill 오버라이드**: 서비스 API는 md/sm이며 Figma에는 md/sm/sm_list가 있다. 확인한 sm_list와 sm의 치수·텍스트 스타일은 동일하다.
- **서비스 크기 2개**: 채팅·Matrix·확정 요약=sm, MemberCard=md. Figma 이름이 추가되어 있다고 코드 variant를 늘리지 않는다.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `id` | string (MembersProvider 키) | — (필수) | 멤버 id. 색/이니셜은 여기서 파생 |
| `size` | `'md'` \| `'sm'` | `'md'` | md=40, sm=28 |
| `dimmed` | boolean | `false` | 흐리게(opacity 0.35) |

## 코드 (이관 전 서비스 발췌)
```jsx
export function Avatar({ id, size = 'md', dimmed = false }) {
  const m = MEMBERS[id];
  return (
    <span
      className={`avatar avatar--${size} ${dimmed ? 'avatar--dimmed' : ''}`}
      style={{ '--avatar-bg': userColorOf(id) }}   // 인덱스 → --user-N
      aria-label={m.name}
    >
      {m.name[0]}
    </span>
  );
}
```
관련 CSS: `.avatar` (`background: var(--avatar-bg, var(--user-1))`) · `.avatar--md`(40) · `.avatar--sm`(28) · `.avatar--dimmed`

## 사용 예시
```jsx
<Avatar id="dan" />              {/* md */}
<Avatar id="mara" size="sm" />   {/* 채팅/현황판 */}
<Avatar id="jessie" dimmed />    {/* 비활성 */}
```
- 현재 패키지는 MembersProvider에 등록된 id를 사용한다. Provider 누락이나 미등록 id는 오류다.
- 색은 Provider 객체 등록 순서의 index%6으로 자동 배정한다. 소비 앱에서 순서를 안정적으로 유지한다. 위 MEMBERS/userColorOf는 분리 전 구현이다.

## 토큰
`--user-1~6`(= primitive/user/N), `--color-text-inverse`, `--radius-full`, `--text-md`/`--text-xs`, `--weight-semibold`

## Figma 매핑
- `JudgeBar/Avatar` · Variant **Size(md/sm/sm_list)** · TEXT **Initial**. 별도 Dimmed variant는 없으며 opacity 오버라이드로 표현한다.
- 코드 색은 primitive/user/1~6에 대응하는 `--user-N`이다. 기존 `semantic/user/N` 표기는 정정한다. Figma 바인딩 경로 전체 검증은 별도 범위다.

## Uses / Used by
- **Uses**: —
- **Used by**: [MessageRow](../molecules/message-row.md), [MemberCard](../molecules/member-card.md), Matrix/Row, [ConfirmedBubble](../organisms/confirmed-bubble.md)
