# Shell/Phone
> 서비스 데모의 기기 프레임(402×874). 베젤 + 상단 노치 + 화면/시트 슬롯.

**Tier** Organism(셸) · **Figma** `Shell/Phone` · **Source** 앱 `.phone`(App/ChatRoom)

## 설계 의도 (왜 이렇게 만들었나)
- 서비스 CSS는 402×874, 베젤 5px, radius 38px을 사용한다. 코드 수치만으로 특정 기기 모델이나 '최신'이라는 제품 속성을 보장하지 않는다.
- Figma는 SLOT으로 화면과 시트 콘텐츠를 삽입한다. 별도 INSTANCE_SWAP 속성이나 React ShellPhone API가 구현됐다고 간주하지 않는다.
- `.phone`은 `position:relative + overflow:hidden` → 바텀 시트 dim을 폰 안에 가둠(뷰포트 오염 방지).

## 코드 (CSS 핵심)
```css
.phone { width:402px; height:874px; border-radius:38px; border:5px solid var(--color-black); overflow:hidden; position:relative; }
.phone__notch { top:12px; width:126px; height:37px; border-radius:var(--radius-full); } /* Dynamic Island */
```

## Figma 매핑
2026-10-14 확인: `Shell/Phone` (61:303) · SLOT **Slot__main/Slot__sheet**. 서비스는 ChatRoom의 div.phone과 Sheet 자식 구조이며 패키지 export는 없다.

## Uses / Used by
- **Uses(slot)**: [Shell/ChatChrome](./shell-chatchrome.md)
- **Used by**: 화면 조립(프로토타입)
