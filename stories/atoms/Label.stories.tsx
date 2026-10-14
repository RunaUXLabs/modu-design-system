import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/Label', component: Label, args: { children: '시점 전환' },
  argTypes: { children: { control: 'text' } },
  parameters: { surface: 'dark', docs: { description: { component: guide('atoms/label.md', '다크 컨트롤 표면의 작은 섹션 라벨입니다.') } } },
} satisfies Meta<typeof Label>;
export default meta;
export const Viewpoint: StoryObj<typeof meta> = {};
export const Time: StoryObj<typeof meta> = { args: { children: '시간 흐름' } };
