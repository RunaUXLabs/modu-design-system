import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/Button', component: Button,
  args: { children: '확인하기', variant: 'primary', size: 'md', full: false, disabled: false, onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'], description: '서비스에서 사용하는 버튼 형태입니다.' },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    children: { control: 'text' },
  },
  parameters: { docs: { description: { component: guide('atoms/button.md', '서비스에서 사용하는 primary/secondary/ghost 버튼입니다. children이 Figma 콘텐츠 슬롯에 대응합니다. JudgeBar의 다음 단계·리셋은 별도 native button입니다.') } } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: '내 응답 수정하기' } };
export const Ghost: Story = { args: { variant: 'ghost', children: '사유 없이 보내기' } };
export const Small: Story = { args: { size: 'sm' } };
export const FullWidth: Story = { args: { full: true } };
export const Click: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '확인하기' }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
export const Disabled: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: '확인하기' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
