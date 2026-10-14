import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleShell, Notice, SlotCard } from '@design-system';
import { guide, slots } from '../fixtures.js';

const meta = {
  title: 'Molecules/BubbleShell', component: BubbleShell,
  args: { title: '회의 시간 제안', subtitle: '응답 현황', children: <SlotCard slot={slots[0]} okCount={2} total={6} /> },
  argTypes: { children: { control: false } },
  parameters: { docs: { description: { component: guide('molecules/bubble-shell.md', '제목과 선택적 부제, 전달받은 콘텐츠를 표시합니다.') } } },
} satisfies Meta<typeof BubbleShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutSubtitle: Story = { args: { subtitle: undefined } };
export const WithNotice: Story = { args: { children: <Notice tone="warn">응답을 확인해주세요.</Notice> } };
