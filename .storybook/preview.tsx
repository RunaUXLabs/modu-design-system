import type { Preview } from '@storybook/react-vite';
import { MembersProvider } from '@design-system';
import { members } from '../stories/fixtures.js';
import '@design-system/tokens/tokens.css';
import '@design-system/styles.css';
import './preview.css';

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => context.parameters.servicePreview ? <Story /> : (
      <MembersProvider members={members}>
        <div className={`sb-preview sb-preview--${context.parameters.surface ?? 'light'}`}>
          <div className="sb-preview__content" style={{ maxWidth: context.parameters.previewWidth ?? 420 }}>
            <Story />
          </div>
        </div>
      </MembersProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Overview', 'Foundations', 'Atoms', 'Molecules', 'Patterns', 'Service Screens'] },
    },
  },
};

export default preview;
