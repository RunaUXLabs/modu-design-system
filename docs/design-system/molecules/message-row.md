# MessageRow
> 채팅 한 줄 — 아바타(sm) + 이름 + MessageBubble. Type: incoming / mine.

**Tier** Molecule · **Figma** `ChatRoom/MessageRow` · **서비스** `modu/src/components/ChatRoom.jsx`에서 패키지 import · **패키지** `src/components/molecules/MessageRow.tsx`

## 설계 의도 (왜 이렇게 만들었나)
- **받은 메시지**만 아바타+이름 노출, **내 메시지**는 우측 정렬·아바타 생략(메신저 관습). 발신자 식별과 정렬로 대화 흐름을 자연스럽게.

## React 구현 (이관 전 서비스 구조 발췌)
```jsx
function Message({ from, me, children }) {
  const mine = from === me;
  return (
    <div className={`chat__msg ${mine ? 'chat__msg--mine' : ''}`}>
      {!mine && <Avatar id={from} size="sm" />}
      <div className="chat__msgbody">
        {!mine && <span className="chat__name">{MEMBERS[from].name}</span>}
        <div className={`chat__text ${mine ? 'chat__text--mine' : ''}`}>{children}</div>
      </div>
    </div>
  );
}
```
CSS: `.chat__msg` · `--mine`(row-reverse) · `.chat__msgbody/name`

현재 API는 from/me/children 필수이며 from===me이면 내 메시지다. 패키지는 MembersProvider를 읽고 MessageBubble을 조립한다. 내 메시지에서도 from은 유효한 멤버 id여야 한다. 위 MEMBERS 직접 참조와 div.chat__text는 분리 전 구현이다.

## Figma 매핑
`ChatRoom/MessageRow` · Variant **Type(incoming/mine)** · TEXT prop **Name** · 중첩 노출 **Avatar·MessageBubble**

## Uses / Used by
- **Uses**: [Avatar](../atoms/avatar.md)(sm), [MessageBubble](../atoms/message-bubble.md)
- **Used by**: [Shell/ChatChrome](../organisms/shell-chatchrome.md) Body
