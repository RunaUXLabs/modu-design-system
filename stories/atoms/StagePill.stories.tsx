import type { Meta, StoryObj } from '@storybook/react-vite';
import { StagePill } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/StagePill', component: StagePill, args: { state: 'default', children: 'T1' },
  argTypes: { state: { control: 'inline-radio', options: ['default', 'past', 'now'] }, children: { control: 'text' } },
  parameters: { surface: 'dark', docs: { description: { component: guide('atoms/stage-pill.md', '현재 단계만 primary로 강조하고 지난 단계는 약하게 표시합니다.') } } },
} satisfies Meta<typeof StagePill>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Past: Story = { args: { state: 'past' } };
export const Now: Story = { args: { state: 'now' } };
