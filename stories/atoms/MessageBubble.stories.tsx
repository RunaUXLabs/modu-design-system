import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageBubble } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/MessageBubble', component: MessageBubble,
  args: { type: 'incoming', children: '개선안 논의는 모여서 하는 게 좋겠네요.' },
  argTypes: { type: { control: 'inline-radio', options: ['incoming', 'mine'] }, children: { control: 'text' } },
  parameters: { surface: 'chat', docs: { description: { component: guide('atoms/message-bubble.md', '비대칭 모서리와 배경색으로 메시지 방향을 구분합니다.') } } },
} satisfies Meta<typeof MessageBubble>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Incoming: Story = {};
export const Mine: Story = { args: { type: 'mine' } };
