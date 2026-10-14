import type { Meta, StoryObj } from '@storybook/react-vite';
import { MatrixRow } from '@design-system';
import { guide, slots, responses, memberIds } from '../fixtures.js';

const meta = {
  title: 'Molecules/MatrixRow', component: MatrixRow,
  args: { id: 'dan', slots, responses: responses.dan, absent: false },
  argTypes: { id: { control: 'select', options: memberIds } },
  render: (args) => <div className="matrix matrix--table"><MatrixRow {...args} /></div>,
  parameters: { docs: { description: { component: guide('molecules/matrix-row.md', '필수/선택 참석과 가능/어려움/미응답을 표시합니다. 불참은 미응답 셀에만 적용됩니다.') } } },
} satisfies Meta<typeof MatrixRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Optional: Story = { args: { required: false } };
export const Unanswered: Story = { args: { responses: {} } };
export const Absent: Story = { args: { responses: {}, absent: true } };
