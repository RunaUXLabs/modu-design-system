import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionTitle } from '@design-system';
import { guide } from '../fixtures.js';
const meta = {
  title: 'Atoms/SectionTitle', component: SectionTitle, args: { children: '가능한 시간' },
  argTypes: { children: { control: 'text' } },
  parameters: { docs: { description: { component: guide('atoms/section-title.md', '라벨 옆 1px 선으로 시트의 섹션 경계를 표시합니다.') } } },
} satisfies Meta<typeof SectionTitle>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
