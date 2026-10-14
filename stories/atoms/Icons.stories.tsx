import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSettings, IconBack, IconSend, IconPin } from '@design-system';
import { guide } from '../fixtures.js';

const meta = {
  title: 'Atoms/Icons', component: IconSettings,
  parameters: { controls: { disable: true }, docs: { description: { component: guide('atoms/icons.md', '기존 크기와 currentColor 벡터를 그대로 사용합니다. 색은 부모에서 상속합니다.') } } },
} satisfies Meta<typeof IconSettings>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Settings: Story = {};
export const Back: Story = { render: () => <IconBack /> };
export const Send: Story = { render: () => <IconSend /> };
export const Pin: Story = { render: () => <IconPin /> };
export const Inventory: Story = {
  render: () => <div className="sb-row">
    <figure className="sb-figure"><IconSettings /><figcaption className="sb-caption">Settings</figcaption></figure>
    <figure className="sb-figure"><IconBack /><figcaption className="sb-caption">Back</figcaption></figure>
    <figure className="sb-figure"><IconSend /><figcaption className="sb-caption">Send</figcaption></figure>
    <figure className="sb-figure"><IconPin /><figcaption className="sb-caption">Pin</figcaption></figure>
  </div>,
};
