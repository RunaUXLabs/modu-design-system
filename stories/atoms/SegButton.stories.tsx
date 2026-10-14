import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn } from 'storybook/test';
import { SegButton, type SegButtonProps } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/SegButton', component: SegButton,
  args: { value: undefined, disabled: false, onChange: fn(), 'aria-label': '참석 가능 여부' },
  argTypes: { value: { control: 'inline-radio', options: [undefined, 'ok', 'hard'] } },
  parameters: { docs: { description: { component: guide('atoms/seg-button.md', '가능/어려움의 controlled 응답 토글입니다. 화살표·Home·End 및 선택 상태를 확인합니다.') } } },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<SegButtonProps>();
    return <SegButton {...args} value={value} onChange={(next) => { args.onChange(next); updateArgs({ value: next }); }} />;
  },
} satisfies Meta<typeof SegButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Unanswered: Story = {};
export const Possible: Story = { args: { value: 'ok' } };
export const Difficult: Story = { args: { value: 'hard' } };
export const Disabled: Story = { args: { value: 'ok', disabled: true } };
export const Keyboard: Story = {
  args: { value: 'ok' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: '가능' }));
    await userEvent.keyboard('{ArrowRight}');
    const hard = canvas.getByRole('radio', { name: '어려움' });
    await expect(hard).toHaveFocus();
    await expect(hard).toHaveAttribute('aria-checked', 'true');
    await expect(args.onChange).toHaveBeenLastCalledWith('hard');
  },
};
