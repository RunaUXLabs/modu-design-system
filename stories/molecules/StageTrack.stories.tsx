import type { Meta, StoryObj } from '@storybook/react-vite';
import { StageTrack } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Molecules/StageTrack', component: StageTrack, args: { phase: 0 },
  argTypes: { phase: { control: 'inline-radio', options: [0, 1, 2, 3] } },
  parameters: { surface: 'dark', docs: { description: { component: guide('molecules/stage-track.md', '현재 단계는 now, 이전 단계는 past, 이후 단계는 default로 표시합니다.') } } },
} satisfies Meta<typeof StageTrack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const T0: Story = {};
export const T1: Story = { args: { phase: 1 } };
export const T2: Story = { args: { phase: 2 } };
export const T3: Story = { args: { phase: 3 } };
