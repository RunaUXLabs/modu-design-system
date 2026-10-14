import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageRow } from '@design-system';
import { guide, memberIds } from '../fixtures.js';

const meta = {
  title: 'Molecules/MessageRow', component: MessageRow,
  args: { from: 'dan', me: 'runa', children: '목요일에는 참석할 수 있어요.' },
  argTypes: { from: { control: 'select', options: memberIds }, me: { control: 'select', options: memberIds }, children: { control: 'text' } },
  parameters: { surface: 'chat', docs: { description: { component: guide('molecules/message-row.md', 'from과 me의 일치 여부로 발신/수신 메시지를 구분합니다.') } } },
} satisfies Meta<typeof MessageRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Incoming: Story = {};
export const Mine: Story = { args: { from: 'runa' } };
