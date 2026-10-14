import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { BubbleShell, MatrixTable, SlotCard, type ResponseValue } from '@design-system';
import { memberIds, responses, slots } from '../fixtures.js';

// This composition is a preview fixture, not a new public component or service workflow.
function ResponsePreview({ onChange }: { onChange: (value: ResponseValue) => void }) {
  const [value, setValue] = useState<ResponseValue>();
  return <BubbleShell title="회의 시간 응답" subtitle="월요일 7월 13일">
    <div className="sb-stack">
      <SlotCard slot={slots[0]} variant="respond" myValue={value} onChange={(next) => { setValue(next); onChange(next); }} />
      <MatrixTable slots={slots} memberIds={memberIds} responses={{ ...responses, runa: { ...responses.runa, mon16: value } }} />
    </div>
  </BubbleShell>;
}
const meta = {
  title: 'Patterns/Response Preview', component: ResponsePreview, args: { onChange: fn() },
  parameters: { surface: 'chat', docs: { description: { component: '시간 카드와 응답 현황표를 조합한 미리보기입니다. 가능·어려움을 선택하면 카드의 선택 표시와 현황표가 함께 바뀝니다. 실제 저장·확정 흐름은 Service Screens에서 확인합니다.' } } },
} satisfies Meta<typeof ResponsePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ChooseResponse: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: '어려움' }));
    await expect(canvas.getByRole('radio', { name: '어려움' })).toHaveAttribute('aria-checked', 'true');
    await expect(args.onChange).toHaveBeenLastCalledWith('hard');
  },
};
