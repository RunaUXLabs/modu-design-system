# Shell/ChatChrome
> 채팅 앱 셸 — header(뒤로/제목/설정) + pinbar + Body 슬롯 + input + push 오버레이.

**Tier** Organism(셸) · **Figma** `Shell/ChatChrome` · **Source** 앱 `.chat__*`(ChatRoom)

## 설계 의도 (왜 이렇게 만들었나)
- **크롬(고정)과 콘텐츠(가변)를 분리**: header·pinbar·input은 셸에 고정, 대화/버블은 **Body slot**으로 교체. 조립·유지가 쉬움.
- **pinbar**: 확정 전까지 스케줄링 버블을 상단 고정 — 제안이 대화에 밀려 올라가 침묵을 낳는 문제 차단.
- **push**: '나와 관련 있을 때만' 뜨는 타겟 배너(오버레이). 기본 숨김(BOOLEAN).

## 코드 (구조)
```jsx
<div className="phone">
  <header className="chat__header"><IconBack/><div className="chat__title"><b>우리팀</b> <span className="chat__count">6</span></div><IconSettings/></header>
  {banner && <button className="push">…</button>}
  {pin && <button className="pinbar"><IconPin/>…</button>}
  <main className="chat__scroll">{/* messages + SchedulingBubble */}</main>
  <footer className="chat__input">…<IconSend/></footer>
  <Sheet />   {/* .phone 자식 */}
</div>
```

## Figma 매핑
2026-10-14 확인: `Shell/ChatChrome` (61:307) · TEXT **Title/Count** · BOOLEAN **Show pinbar/Show push** · SLOT **Slot 2**. 기존 INSTANCE_SWAP Body 설명은 정정한다. 서비스 ChatRoom은 store에서 내용을 계산하며 별도 ShellChatChrome 패키지 컴포넌트는 없다.

## Uses / Used by
- **Uses**: [Icons](../atoms/icons.md), pinbar/push/input(인라인), Body(slot ← 채팅 스레드/버블), [Sheet](./sheet-respond.md)
- **Used by**: Figma [Shell/Phone](./shell-phone.md)의 화면 슬롯. 서비스는 ChatRoom이 phone과 chat 구조를 함께 렌더링한다.
