import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Field } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/Field', component: Field,
  args: { label: '제목', value: '우리팀 회의', source: '캘린더 기준 제안 — 눌러서 바꿀 수 있어요', showSource: true, onClick: fn() },
  argTypes: { value: { control: 'text' }, source: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/field.md', '라벨·제안값·출처를 표시합니다. 클릭 이후의 편집 상태는 소비 앱에서 관리합니다.') } } },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Suggested: Story = {};
export const WithoutSource: Story = { args: { showSource: false } };
