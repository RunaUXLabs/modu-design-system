import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notice } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/Notice', component: Notice,
  args: { tone: 'neutral', children: '어려우면 응답 마감까지 알려주세요.' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'weak', 'warn', 'danger', 'success'] }, children: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/notice.md', '문장형 보조 안내는 14px 이상이며 weak는 배경과 패딩 없이 사용합니다.') } } },
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Neutral: Story = {};
export const Weak: Story = { args: { tone: 'weak', children: '응답하지 않아도 괜찮아요.' } };
export const Warn: Story = { args: { tone: 'warn', children: '확인 기한이 지나 필참자에게만 다시 알렸어요.' } };
export const Danger: Story = { args: { tone: 'danger', children: '모두 가능한 시간이 없어요.' } };
export const Success: Story = { args: { tone: 'success', children: '회의가 확정됐어요.' } };
