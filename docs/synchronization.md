# 서비스 최신본 동기화

기준일: 2026-10-14. 방향: `modu` 서비스 → 독립 `modu-design-system` 저장소. 양방향 자동 동기화는 설정하지 않았다.

## 대응 경로

| 서비스 원본 | 이 저장소 | 처리 |
| --- | --- | --- |
| src/design-system | src | 구현·타입·토큰·CSS·테스트를 동일하게 반영 |
| stories | stories | 최신 구성 반영, 독립 저장소를 설명하는 경로 문구만 조정 |
| .storybook | .storybook | 최신 preview 유지, alias를 로컬 src/examples로 조정 |
| src/features | examples/service/features | 실제 서비스 예제 스냅샷 |
| src/pages | examples/service/pages | 실제 서비스 예제 스냅샷 |
| src/styles.css | examples/service/styles.css | 서비스 프레임 전용 CSS |
| docs/design-system | docs/design-system | 최신 가이드 반영 후 현재 API·경로 오류 정정 |

서비스의 package.json, lockfile, 배포 workflow, vendor, dist, node_modules 및 Git 정보는 복사하지 않았다. 독립 패키지의 ESM·타입 선언·CSS export·React peer 설정·pnpm 버전·lockfile을 유지했다. 의존성 변경이나 설치는 하지 않았다.

## 반영한 차이

- Button의 danger 타입·스타일·예제를 제거한 서비스 최신본 반영.
- Field의 ariaLabel과 children 슬롯 반영. 편집 동작은 scheduling feature에 유지.
- Board·MatrixTable·SectionTitle을 공통 UI로 사용하는 최신 서비스 조합 반영.
- Response Preview를 Patterns로 이동한 구성 반영.
- 기존 Integration/MembersProvider 및 API Reference/Unused Button 예제 제거.
- 형제 서비스 경로 의존성을 없애 단독 저장소에서 전체 Storybook 실행 가능하도록 조정.

## 재동기화 원칙

서비스를 계속 SSOT로 삼는 동안 원본 경로의 변경을 먼저 확인하고 위 대응 경로로 반영한다. 서비스 상태 머신을 라이브러리 src로 옮기거나 예제를 공개 API로 export하지 않는다. stories/Overview와 화면 설명, alias, 독립 패키지 문서는 저장소별 경로를 유지한다. 변경 후 라이브러리 테스트·빌드와 서비스 예제 테스트·Storybook 타입 검사·정적 빌드를 각각 확인한다.

서비스는 내부 모듈을 직접 사용하므로 이 저장소 수정이 서비스에 자동 적용되지 않는다. 향후 서비스가 패키지를 설치하는 구조로 전환할지는 별도 결정이다. GitHub 저장소 등록과 npm 발행도 서로 다른 절차다.

## 검증

- Storybook 타입 검사 통과.
- 라이브러리 단위 테스트 18개 통과. 이전 19개에서 미사용 danger 테스트 1개가 제거된 최신 구성이다.
- 서비스 화면 예제 테스트 8개 통과.
- 라이브러리 타입 검사·ESM 빌드·타입 선언·토큰 복사 통과.
- Storybook 정적 빌드 통과. preview decorator docgen 생략 및 큰 chunk 경고가 있으며 빌드 실패는 아니다.
- 생성된 Storybook index에서 27개 story 파일, 109개 예제 확인. Patterns 7개, Service Screens 15개.
- 공통 모듈 33개, 서비스 feature 5개·page 2개 파일은 원본과 해시 일치. Markdown 41개의 로컬 링크 검사 통과.
- 패키지 dry-run 통과(74개 파일). 실제 tarball 생성·설치·레지스트리 발행은 하지 않았다.
- 브라우저 play·접근성·Figma 픽셀 비교는 위 검사로 대체하지 않는다.
