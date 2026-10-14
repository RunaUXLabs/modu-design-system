import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ServicePreview, scenarios } from './service-preview.jsx';

const meta = {
  title: 'Service Screens/Meeting States', component: ServicePreview,
  args: { scenario: 'compose', view: 'screen' },
  argTypes: { scenario: { control: 'select', options: Object.keys(scenarios) }, view: { control: false } },
  parameters: {
    servicePreview: true,
    docs: { description: { component: 'examples/service에 동기화한 실제 ChatRoom과 Sheet를 렌더링합니다. 각 시작 상태는 서비스 store 액션으로 구성하고 이후 클릭도 같은 reducer가 처리합니다. 토큰과 UI는 현재 패키지 src를 사용합니다. 서비스 예제는 배포 패키지에 포함되지 않으며 자동으로 원본 서비스와 동기화되지는 않습니다.' } },
  },
} satisfies Meta<typeof ServicePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Compose: Story = { name: '회의 생성 전' };
export const ComposeSheet: Story = {
  name: '회의 정보 편집', args: { scenario: 'composeSheet' },
  parameters: { docs: { description: { story: 'Field 표시/편집, native input, 참석자 선택, 생성 footer는 실제 ComposeSheet입니다. Figma body/Slot_Fixed/footer 조합과 비교합니다.' } } },
};
export const ProposalRequired: Story = { name: '잠정 확정 · 필참자', args: { scenario: 'proposalRequired' } };
export const ProposalOptional: Story = { name: '잠정 확정 · 선택 참석자', args: { scenario: 'proposalOptional' } };
export const Coordination: Story = { name: '일정 조율 · 주최자', args: { scenario: 'coordination' } };
export const ResponsePreset: Story = { name: '응답 시트 · 캘린더 제안', args: { scenario: 'responsePreset' } };
export const ResponseEdit: Story = { name: '응답 시트 · 기존 응답 수정', args: { scenario: 'responseEdit' } };
export const Organizer: Story = { name: '주최자 현황 · 마감 이후', args: { scenario: 'organizer' } };
export const Confirmed: Story = { name: '확정 요약', args: { scenario: 'confirmed' } };
export const NoSlot: Story = { name: '실패 · 교집합 없음', args: { scenario: 'noSlot' } };
export const EditMeetingTitle: Story = {
  name: '상호작용 · 제목 편집', args: { scenario: 'composeSheet' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: /다음 주 개선안 회의/ }));
    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, '디자인 시스템 검토{Enter}');
    await expect(canvas.getByRole('button', { name: /디자인 시스템 검토/ })).toBeVisible();
  },
};
export const SaveResponse: Story = {
  name: '상호작용 · 응답 선택과 저장', args: { scenario: 'responsePreset' },
  play: async ({ canvas, userEvent }) => {
    const choices = await canvas.findAllByRole('radio', { name: '가능' });
    await userEvent.click(choices[0]);
    await expect(choices[0]).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(canvas.getByRole('button', { name: '응답 저장' }));
    await expect(await canvas.findByRole('button', { name: '내 응답 수정하기' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: '응답 저장' })).not.toBeInTheDocument();
  },
};
export const RecoverFromNoSlot: Story = {
  name: '상호작용 · 기간 확장', args: { scenario: 'noSlot' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: '기간을 넓혀 다시 찾기' }));
    await expect(await canvas.findByText('기간을 넓혀 다시 조율하고 있어요')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: '기간을 넓혀 다시 찾기' })).not.toBeInTheDocument();
  },
};
