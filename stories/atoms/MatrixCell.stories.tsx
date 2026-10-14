import type { Meta, StoryObj } from '@storybook/react-vite';
import { MatrixCell } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/MatrixCell', component: MatrixCell, args: { state: 'none', children: '–' },
  argTypes: { state: { control: 'inline-radio', options: ['head', 'ok', 'hard', 'none'] }, children: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/matrix-cell.md', '좁은 폰 폭의 현황표를 위한 상태 셀입니다.') } } },
} satisfies Meta<typeof MatrixCell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Unanswered: Story = {};
export const Header: Story = { args: { state: 'head', children: '월 16:00' } };
export const Possible: Story = { args: { state: 'ok', children: '✓' } };
export const Difficult: Story = { args: { state: 'hard', children: '✕' } };
