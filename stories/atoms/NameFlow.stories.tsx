import type { Meta, StoryObj } from '@storybook/react-vite';
import { NameFlow } from '@design-system';
import { guide, memberIds } from '../fixtures.js';

const meta = {
  title: 'Atoms/NameFlow', component: NameFlow,
  args: { ids: ['dan', 'mara', 'william'], suffix: '님의 응답을 기다리고 있어요' },
  argTypes: { ids: { control: 'check', options: memberIds }, suffix: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/name-flow.md', '이름만 굵게 표시하는 자연어 문장 조각입니다. 빈 명단은 렌더하지 않습니다.') } } },
} satisfies Meta<typeof NameFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Waiting: Story = {};
export const SingleMember: Story = { args: { ids: ['dan'] } };
export const Empty: Story = { args: { ids: [] } };
