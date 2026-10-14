import type { Meta, StoryObj } from '@storybook/react-vite';
import { MatrixTable } from '@design-system';
import { guide, slots, memberIds, responses } from '../fixtures.js';

const meta = {
  title: 'Molecules/MatrixTable', component: MatrixTable,
  args: { slots, memberIds, responses },
  parameters: { docs: { description: { component: guide('molecules/matrix-table.md', '슬롯과 멤버 순서는 전달받은 배열을 따릅니다. 응답 집계나 일정 선정은 서비스 책임입니다.') } } },
} satisfies Meta<typeof MatrixTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Unanswered: Story = { args: { responses: {} } };
export const OptionalMembers: Story = { args: { requiredIds: [] } };
export const AbsentMember: Story = { args: { outMembers: ['william'] } };
export const NarrowScreen: Story = { parameters: { previewWidth: 320 } };
