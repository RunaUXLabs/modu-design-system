# modu-design-system

모두의 시간 서비스 코드를 기준으로 분리한 React + TypeScript 디자인 시스템입니다. Atom 18개(아이콘 4개 포함), Molecule 7개와 MembersProvider를 제공합니다.

## 저장소 구조

```text
src/                  공개 컴포넌트, 타입, 토큰, 스타일, 단위 테스트
stories/              Foundations / Atoms / Molecules / Patterns / Service Screens
.storybook/           독립 Storybook 설정
examples/service/     서비스의 feature/page/CSS 스냅샷, 예제 전용
docs/                 가이드라인, API, 구현 및 검증 기록
```

2026-10-14에 서비스의 `src/design-system`과 최신 Storybook을 동기화했습니다. 서비스 상태 머신과 화면은 `examples/service`로 분리해 형제 `modu` 폴더 없이도 Storybook을 실행할 수 있습니다. 예제와 Storybook은 배포 패키지에 포함하지 않습니다. [동기화 범위와 원본 대응](docs/synchronization.md)을 참고하세요.

## 개발

Node 22.13.0 이상, pnpm 12.11.2가 필요합니다. 의존성 설치는 개발자가 직접 수행합니다. `packageManager`는 버전을 고정하지만 기존 실행 파일이나 Windows PATH를 교체하지는 않습니다.

```powershell
pnpm --version
pnpm install --frozen-lockfile
pnpm run check
pnpm run storybook
```

Storybook 기본 주소는 `http://localhost:6006`입니다. 포트가 사용 중이면 `pnpm exec storybook dev -p 6007 --no-open`으로 다른 포트를 지정할 수 있습니다.

```powershell
pnpm run typecheck:storybook
pnpm run test:service-stories
pnpm run build:storybook
```

`check`는 라이브러리 테스트와 빌드를 실행합니다. 서비스 예제 테스트와 Storybook 검증은 별도입니다. pnpm 설치 스크립트 승인은 기존 `pnpm-workspace.yaml`의 esbuild 허용을 유지합니다. 의존성을 변경할 때만 `pnpm install --no-frozen-lockfile`로 lockfile을 갱신합니다.

## 패키지 사용

```tsx
import { Button, MembersProvider, Avatar } from 'modu-design-system';
import 'modu-design-system/style.css';

const members = { dan: { id: 'dan', name: '댄', required: true } };

export function Example() {
  return <MembersProvider members={members}>
    <Avatar id="dan" size="sm" />
    <Button onClick={() => console.log('confirm')}>확인하기</Button>
  </MembersProvider>;
}
```

`build`는 ESM, 타입 선언, `style.css`, `tokens.css`를 `dist/`에 생성합니다. JS import만으로 CSS를 자동 주입하지 않습니다. 토큰만 사용한다면 `modu-design-system/tokens.css`를 import합니다. React와 React DOM은 소비 앱이 제공하는 peer dependency입니다. Pretendard 파일은 포함하지 않으며 폰트 로딩은 소비 앱이 담당합니다. React 19 peer 범위는 선언했지만 실행 검증은 React 18 기준입니다.

로컬 설치 산출물은 `pnpm pack --pack-destination ./artifacts`로 만들고 소비 앱에서 `pnpm add <tarball 경로>`로 설치합니다. 현재 `modu`는 내부 모듈을 사용하므로 이 패키지에 자동 연결되지 않습니다. 이번 동기화로 서비스 의존성이나 lockfile을 변경하지 않았습니다.

## 문서

- [Storybook 실행 및 검토](docs/storybook-guide.md)
- [동기화 기록과 저장소 경계](docs/synchronization.md)
- [컴포넌트 가이드라인](docs/design-system/README.md)
- [토큰 명세](DESIGN-SYSTEM.md)
- [패키지 API](docs/package-api.md)
- [구현 계획](docs/implementation-plan.md)
- [SSOT 점검 이력](docs/ssot-audit.md)
- [포트폴리오 기록](docs/portfolio-case-study.md)

SSOT는 실제 서비스 코드입니다. Figma 슬롯과 React children/props를 구분하며 문서만으로 variant를 추가하지 않습니다. Button은 primary/secondary/ghost만 지원합니다. 회의 상태, 저장·마감 처리 및 화면 셸은 공개 API가 아닙니다.

## GitHub 및 배포

소스, 설정, 문서, `examples/service`, `pnpm-lock.yaml`을 함께 관리합니다. `node_modules`, `dist`, `storybook-static`, tarball은 Git에서 제외합니다. 별도 저장소를 체크아웃해 설치한 뒤 라이브러리와 Storybook을 각각 빌드할 수 있습니다.

현재 `private: true`로 npm 발행을 차단합니다. GitHub 저장소 생성·원격 설정·푸시, Storybook 공개 배포, npm 발행은 이번 작업에 포함하지 않습니다. 비공개 레지스트리 발행 시 scope·이름·레지스트리·접근 정책을 결정하고 인증은 사용자 설정 또는 CI secret으로 공급해야 합니다.
