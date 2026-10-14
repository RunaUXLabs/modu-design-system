import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemberCard } from '@design-system';
import { guide, memberIds } from '../fixtures.js';

const meta = {
  title: 'Molecules/MemberCard', component: MemberCard,
  args: { id: 'dan', active: false, onClick: fn() },
  argTypes: { id: { control: 'select', options: memberIds } },
  parameters: { surface: 'dark', docs: { description: { component: guide('molecules/member-card.md', '멤버 정보와 active 상태를 외부에서 전달합니다.') } } },
} satisfies Meta<typeof MemberCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const DescriptionOverride: Story = { args: { desc: '선택 참석' } };
