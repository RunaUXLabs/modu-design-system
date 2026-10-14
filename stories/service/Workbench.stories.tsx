import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServicePreview, scenarios } from './service-preview.jsx';

const meta = {
  title: 'Service Screens/Workbench', component: ServicePreview,
  args: { scenario: 'compose', view: 'workbench' },
  argTypes: { scenario: { control: 'select', options: Object.keys(scenarios) }, view: { control: false } },
  parameters: { servicePreview: true, docs: { description: { component: '실제 JudgeBar와 ChatRoom을 함께 렌더링합니다. 계정 전환·시간 진행·리셋으로 서비스 화면을 탐색합니다. 레이아웃 프레임만 Storybook용이며 서비스 컴포넌트와 store는 복제하지 않습니다. 다시 시작하려면 story를 재마운트하거나 서비스 리셋을 사용합니다.' } } },
} satisfies Meta<typeof ServicePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FromStart: Story = { name: '생성부터 탐색' };
export const AfterDeadline: Story = { name: '마감 이후 탐색', args: { scenario: 'organizer' } };
