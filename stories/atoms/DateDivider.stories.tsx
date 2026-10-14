import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateDivider } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/DateDivider', component: DateDivider,
  args: { children: '2026년 7월 9일 목요일' }, argTypes: { children: { control: 'text' } },
  parameters: { surface: 'chat', docs: { description: { component: guide('atoms/date-divider.md', '채팅 흐름에 날짜 앵커를 중앙 정렬로 표시합니다.') } } },
} satisfies Meta<typeof DateDivider>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
