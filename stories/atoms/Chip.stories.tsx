import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/Chip', component: Chip, args: { tone: 'neutral', children: '지금 1순위' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'primary', 'danger', 'success', 'warn'] }, children: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/chip.md', '상태 요약 전용입니다. 클릭 가능한 버튼으로 사용하지 않습니다.') } } },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Neutral: Story = {};
export const Primary: Story = { args: { tone: 'primary', children: '확인 대기' } };
export const Danger: Story = { args: { tone: 'danger', children: '어려워요' } };
export const Success: Story = { args: { tone: 'success', children: '가능해요' } };
export const Warn: Story = { args: { tone: 'warn', children: '확인 필요' } };
