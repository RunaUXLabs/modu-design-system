import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn } from 'storybook/test';
import { SlotCard, type SlotCardProps, type ResponseValue } from '@design-system';
import { guide, slots } from '../fixtures.js';

const meta = {
  title: 'Molecules/SlotCard', component: SlotCard,
  parameters: { docs: { description: { component: guide('molecules/slot-card.md', 'hero/respond/tally별 필수 props가 다른 discriminated union입니다. 응답 값은 부모가 관리합니다.') } } },
  argTypes: { variant: { control: false }, slot: { control: 'object' } },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SlotCardProps>();
    if (args.variant !== 'respond') return <SlotCard {...args} />;
    return <SlotCard {...args} onChange={(value: ResponseValue) => { args.onChange(value); updateArgs({ myValue: value }); }} />;
  },
} satisfies Meta<typeof SlotCard>;
export default meta;
type Story = StoryObj<typeof SlotCard>;
export const Hero: Story = { args: { slot: slots[0], variant: 'hero' } };
export const Tally: Story = { args: { slot: slots[0], variant: 'tally', okCount: 4, total: 6, onClick: fn() } };
export const EmptyTally: Story = { args: { slot: slots[0], variant: 'tally', okCount: 0, total: 0 } };
export const Best: Story = { args: { slot: slots[1], variant: 'tally', okCount: 5, total: 6, best: true } };
export const MyPossible: Story = { args: { slot: slots[0], variant: 'tally', okCount: 4, total: 6, myValue: 'ok' } };
export const MyDifficult: Story = { args: { slot: slots[0], variant: 'tally', okCount: 4, total: 6, myValue: 'hard' } };
export const Respond: Story = {
  args: { slot: slots[0], variant: 'respond', onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: '가능' }));
    await expect(canvas.getByRole('radio', { name: '가능' })).toHaveAttribute('aria-checked', 'true');
    if (args.variant === 'respond') await expect(args.onChange).toHaveBeenLastCalledWith('ok');
  },
};
export const Preset: Story = { args: { slot: slots[0], variant: 'respond', myValue: 'ok', preset: true, onChange: fn() } };
