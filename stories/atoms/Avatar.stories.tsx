import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@design-system';
import { guide, members } from '../fixtures.js';

const meta = {
  title: 'Atoms/Avatar', component: Avatar,
  args: { id: 'dan', size: 'md', dimmed: false },
  argTypes: { id: { control: 'select', options: Object.keys(members) }, size: { control: 'inline-radio', options: ['md', 'sm'] } },
  parameters: { docs: { description: { component: guide('atoms/avatar.md', '멤버 등록 순서로 6색을 순환 배정하는 이니셜 아바타입니다. 색 지정 prop은 없습니다.') } } },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Dimmed: Story = { args: { dimmed: true } };
export const ColorCycle: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="sb-row">{Object.values(members).map((member) => <figure className="sb-figure" key={member.id}>
    <Avatar id={member.id} /><figcaption className="sb-caption">{member.name}</figcaption>
  </figure>)}</div>,
};
