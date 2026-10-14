# MemberCard
> 테스터 바의 멤버 카드 — 아바타 + 이름 + 역할 배지(주최자/필참/선택). 현재 시점이면 active.

**Tier** Molecule · **Figma** `JudgeBar/MemberCard` · **서비스** `modu/src/components/JudgeBar.jsx` · **패키지** `src/components/molecules/MemberCard.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- 6명 시점을 오가는 테스터용 스위처. **누구로 보는가**를 아바타(유저색)+이름+역할로 한 번에. active(현재 계정)만 primary 보더로.
- 서비스 역할 문구는 주최자=runa, 필참=required, 그 외 선택 참석에서 파생하며 마라의 '수요일 외근'을 부기한다. 이것은 데모 서비스 규칙이며 패키지에 하드코딩하지 않는다.

## React 구현 (서비스 구조 설명)
```jsx
<button className={`judge__member ${current===id?'judge__member--active':''}`} onClick={()=>switchUser(id)}>
  <Avatar id={id} size="md" />
  <span className="judge__membername">{MEMBERS[id].name}</span>
  <span className="judge__memberdesc">{role}</span>
</button>
```
CSS: `.judge__member` · `--active`(primary 보더+surface-active-dark) · `.judge__membername/memberdesc`

현재 패키지 API는 id 필수, active=false, desc?, onClick?이다. MembersProvider의 이름과 desc를 읽고, desc prop이 제공되면 이를 우선한다. active 및 계정 전환은 부모가 관리한다. 서비스 JudgeBar가 역할 문구와 SWITCH_USER callback을 전달한다.

## Figma 매핑
`JudgeBar/MemberCard` · Variant **State(default/active)** · TEXT prop **Name·Desc** · 중첩 노출 **Avatar**

## Uses / Used by
- **Uses**: [Avatar](../atoms/avatar.md)(md)
- **Used by**: [JudgeBar](../organisms/judgebar.md)
