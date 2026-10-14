import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServicePreview } from '../service/service-preview.jsx';

const meta = {
  title: 'Patterns/Bubble Composition', component: ServicePreview,
  args: { scenario: 'proposalRequired', view: 'bubble' },
  argTypes: { scenario: { control: false }, view: { control: false } },
  parameters: { servicePreview: true, docs: { description: { component: '서비스 SchedulingBubble을 직접 재사용하여 BubbleShell의 콘텐츠 조합을 확인합니다. Figma의 Notice/SlotCard/Button/Chip/Board 슬롯은 React children과 서비스 영역 마크업으로 표현합니다. 아래 설명은 실제 소스 조립 관계이며 새로운 슬롯 API를 추가하지 않습니다. 시트를 열면 실제 Sheet가 같은 phone 프레임 안에 표시됩니다.' } } },
} satisfies Meta<typeof ServicePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Compose: Story = {
  name: '생성 · 안내와 주 액션', args: { scenario: 'compose' },
  parameters: { docs: { description: { story: 'ComposeCard: BubbleShell → Notice neutral → bubble__actions/Button primary. 주최자만 표시. store는 회의 메타와 시트 열기를 관리합니다.' } } },
};
export const Proposal: Story = {
  name: '제안 · 시간과 확인 요청',
  parameters: { docs: { description: { story: 'ProposalBubble: SlotCard hero → weak/neutral Notice → 계정별 Button 또는 Chip → Board 인스턴스. 상태와 동작은 scheduling feature에서 주입합니다.' } } },
};
export const Coordination: Story = {
  name: '조율 · 반복 슬롯과 집계', args: { scenario: 'coordination' },
  parameters: { docs: { description: { story: 'CoordinationBubble: 호스트 전용 이의 Notice → bubble__slots/SlotCard tally 목록 → 계정별 CTA → Board. 색 칩은 개인 응답, 게이지는 전체 집계, best는 서비스가 결정합니다.' } } },
};
export const Confirmed: Story = {
  name: '확정 · 참석자와 영수증', args: { scenario: 'confirmed' },
  parameters: { docs: { description: { story: 'ConfirmedBubble: SlotCard hero → Avatar 목록 → 불참/미확인 Notice → success Notice → 조율 영수증. 외부 예약 API를 검증하는 화면은 아닙니다.' } } },
};
export const NoSlot: Story = {
  name: '실패 · 회복 액션', args: { scenario: 'noSlot' },
  parameters: { docs: { description: { story: 'NoSlotBubble: 주최자에게 기간 확장 Button primary, 팀원에게 안내 Notice. 실패 상태는 기존 서비스 reducer의 COORD_RESPOND 경로로 준비합니다.' } } },
};
