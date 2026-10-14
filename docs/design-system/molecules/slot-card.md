# SlotCard
> 회의 시간 슬롯 카드. **하나의 컴포넌트가 3맥락에서 재사용**된다 — `hero`(잠정확정), `tally`(조율 집계), `respond`(응답 입력).

**Tier** Molecule · **Figma** `SlotCard` (52:165) · **서비스** `modu/src/components/SlotCard.jsx` 재export · **패키지** `src/components/molecules/SlotCard.tsx`

## 언제 쓰나
- `hero`: 잠정 확정/확정 버블에서 확정 슬롯을 크게.
- `tally`: 조율 버블에서 슬롯별 가능 인원 집계 + 내 응답 + 쏠림 게이지.
- `respond`: 응답 시트에서 SegButton으로 가능/어려움 입력.

## 설계 의도 (왜 이렇게 만들었나)
- **하나의 컴포넌트로 3맥락(hero/tally/respond)**: 셋 다 '회의 슬롯'이라는 같은 개념, 맥락만 다름. 화면별 카드 난립을 막고 일관성 유지(primitives 원칙).
- **인코딩 분리** — 색 칩=‘내 상태’, 하단 게이지=‘팀의 쏠림’, 우상단 플래그=‘지금 1순위’: 한 색/한 요소에 여러 의미를 실으면 "내가 고른 것"과 "팀 분포"를 혼동. 채널을 분리해 오독을 차단.
- **게이지 위에 인원 문구 오버레이**: 막대만으론 수치 오독 → 문장(‘팀원 N명이 가능하대요’) 병기.
- **tally는 `<button>`(카드 탭 → 시트)**: 조율 맥락에선 카드 자체가 응답 진입점.

## React API
| prop | type | default | 설명 |
|---|---|---|---|
| `slot` | `{day,date,time,room}` | — (필수) | 슬롯 데이터 |
| `variant` | `'hero'`\|`'tally'`\|`'respond'` | `'tally'` | 맥락 |
| `okCount` | number | — | tally 필수. 가능 인원 |
| `total` | number | — | tally 필수. 게이지 분모 |
| `myValue` | `'ok'`\|`'hard'`\|undefined | — | (tally/respond) 내 응답 |
| `best` | boolean | `false` | (tally) '지금 1순위' 플래그 |
| `preset` | boolean | `false` | (respond) 캘린더 제안값(확인 필요, 점선) |
| `onChange` | fn(ok/hard) | — | respond 필수. 응답 변경 |
| `onClick` | fn | — | (tally) 카드 탭 → 응답 시트 |

패키지는 variant별 discriminated union이다. hero에는 slot, respond에는 slot/onChange, tally에는 slot/okCount/total이 필수다. respond의 myValue는 부모가 갱신해야 선택 표시가 바뀐다. 슬롯 선정·응답 집계·best 결정은 서비스 책임이다. total=0이면 게이지 0%, okCount=0이면 응답 수집 중 문구를 표시한다.

## 코드 (구조 발췌)
```jsx
if (variant === 'hero') return (
  <div className="slotcard slotcard--hero">
    <div className="slotcard__day">{slot.day}</div>
    <div className="slotcard__main"><span className="slotcard__date">{slot.date}</span><span className="slotcard__time">{slot.time}</span></div>
    <div className="slotcard__room">{slot.room} 예약됨</div>
  </div>
);
if (variant === 'respond') return (
  <div className={`slotcard slotcard--respond ${preset ? 'slotcard--preset' : ''}`}>
    <div className="slotcard__info">…</div>
    <SegButton value={myValue} onChange={onChange} />
  </div>
);
// tally: 색 칩=내 상태, 하단 게이지=팀 쏠림, 우상단 flag=1순위
return (
  <button className="slotcard slotcard--tally" onClick={onClick}>
    {best && <span className="slotcard__flag"><Chip tone="neutral">지금 1순위</Chip></span>}
    <div className="slotcard__info">…</div>
    <div className="slotcard__meta">{myValue==='ok' && <Chip tone="success">가능해요</Chip>}{myValue==='hard' && <Chip tone="danger">어려워요</Chip>}</div>
    <span className="slotcard__gauge"><i style={{width:`${…}%`}}/><em className="slotcard__gaugetext">{gaugeText}</em></span>
  </button>
);
```
관련 CSS: `.slotcard--hero/tally/respond` · `.slotcard__day/main/date/time/room/info/meta/flag/gauge/gaugetext` · `.slotcard--preset`

## 사용 예시
```jsx
<SlotCard slot={PROPOSAL_SLOT} variant="hero" />
<SlotCard slot={s} variant="tally" okCount={4} total={6} myValue="ok" best onClick={openSheet} />
<SlotCard slot={s} variant="respond" myValue={val} onChange={setVal} preset />
```
- ✅ Do: 맥락에 맞는 variant만. tally는 `okCount`/`total` 함께.
- ❌ Don't: 색 칩(내 상태)과 게이지(팀 쏠림)를 같은 의미로 쓰지 말 것 — 인코딩 분리가 설계 의도.

## 토큰
`--color-primary-weak`(hero/게이지), `--color-primary`, `--color-surface-sub`, `--color-line`, `--color-text`/`--color-text-sub`, `--radius-md`, `--shadow-card`, `--text-lg/md/sm`

## Figma 매핑
- 2026-10-14 확인: `SlotCard`에는 Variant=hero/tally/respond와 별도 이름 escalation 자식이 있다. 속성 정의 조회는 'Component set has existing errors'로 실패하여 TEXT Day/Date/Time/Room/Gauge를 현재 공개 속성이라고 확정할 수 없다.
- 서비스 escalation은 Sheet의 `.sheet__escalation` 영역이다. 공개 SlotCard의 네 번째 variant가 아니다. Figma set 오류 원인은 편집기에서 추가 확인한다.
- 내부 재활용: [Chip](../atoms/chip.md)(내 상태·플래그), [SegButton](../atoms/seg-button.md)(respond)

## Uses / Used by
- **Uses**: [Chip](../atoms/chip.md), [SegButton](../atoms/seg-button.md)
- **Used by**: [ProposalBubble](../organisms/proposal-bubble.md)(hero), CoordinationBubble(tally), ConfirmedBubble(hero), [Sheet/Respond](../organisms/sheet-respond.md)(respond)
