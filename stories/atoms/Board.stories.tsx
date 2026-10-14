import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Board } from '@design-system';
import { guide, memberIds } from '../fixtures.js';

const meta = {
  title: 'Atoms/Board', component: Board,
  args: { waiting: ['dan', 'mara'], suffix: '님의 확인이 꼭 필요해요', deadline: '응답하지 않은 분들은 참석 가능한 것으로 정리돼요', onClick: fn() },
  argTypes: { waiting: { control: 'check', options: memberIds }, suffix: { control: 'text' }, deadline: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/board.md', '대기자와 마감 규칙을 함께 보여줍니다. 박스 전체가 응답 진입 타깃입니다.') } } },
} satisfies Meta<typeof Board>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Waiting: Story = {};
export const NoWaitingMembers: Story = { args: { waiting: [] } };
