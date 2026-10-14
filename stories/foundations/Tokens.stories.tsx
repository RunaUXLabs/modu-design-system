import { useMemo, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import tokenSource from '@design-system/tokens/tokens.css?raw';
import { guide } from '../fixtures.js';

type Category = 'palette' | 'semantic' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'motion';
const prefixes: Record<Category, readonly string[]> = {
  palette: ['--white', '--black', '--gray-', '--slate-', '--blue-', '--user-', '--red-', '--green-', '--amber-', '--alpha-'],
  semantic: ['--color-'], typography: ['--font-', '--text-', '--leading-', '--weight-'],
  spacing: ['--space-'], radius: ['--radius-'], shadow: ['--shadow-'], motion: ['--duration-', '--ease-'],
};

function Tokens({ category }: { category: Category }) {
  const tokens = useMemo(() => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(tokenSource);
    return Array.from(sheet.cssRules).flatMap((rule) => {
      if (!(rule instanceof CSSStyleRule) || rule.selectorText !== ':root') return [];
      return Array.from(rule.style).map((name) => ({ name, value: rule.style.getPropertyValue(name).trim() }));
    });
  }, []);
  const selected = tokens.filter(({ name }) => prefixes[category].some((prefix) => name.startsWith(prefix)));
  function sample(name: string) {
    if (category === 'palette' || category === 'semantic') return <span className="sb-swatch" style={{ background: `var(${name})` }} />;
    if (category === 'spacing') return <span className="sb-measure" style={{ width: `var(${name})` }} />;
    if (category === 'radius') return <span className="sb-swatch" style={{ background: 'var(--color-primary-weak)', borderRadius: `var(${name})` }} />;
    if (category === 'shadow') return <div className="sb-sample" style={{ boxShadow: `var(${name})` }}>회의 시간</div>;
    if (category === 'motion') return name.startsWith('--duration-') ? <div className={`sb-motion sb-motion--${name.slice('--duration-'.length)}`} /> : <code>{tokens.find((token) => token.name === name)?.value}</code>;
    const style: CSSProperties = name.startsWith('--text-') ? { fontSize: `var(${name})` }
      : name.startsWith('--weight-') ? { fontWeight: `var(${name})` }
      : name.startsWith('--leading-') ? { lineHeight: `var(${name})` } : { fontFamily: `var(${name})` };
    return <span style={style}>모두의 시간 · Aa 0123</span>;
  }
  return <table className="sb-token-table">
    <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Preview</th></tr></thead>
    <tbody>{selected.map(({ name, value }) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{value}</code></td><td>{sample(name)}</td></tr>)}</tbody>
  </table>;
}

const meta = {
  title: 'Foundations/Tokens', component: Tokens, args: { category: 'palette' },
  argTypes: { category: { control: false } },
  parameters: { previewWidth: 900, docs: { description: { component: guide('foundation-guide.md', '토큰 정본 src/design-system/tokens/tokens.css를 CSS 파서로 읽습니다. 미리보기용 토큰 값을 별도로 복제하지 않습니다. 폰트 파일은 소비 앱에서 로딩하며 현재 환경에서는 시스템 폴백이 사용될 수 있습니다.') } } },
} satisfies Meta<typeof Tokens>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Palette: Story = {};
export const SemanticColors: Story = { args: { category: 'semantic' } };
export const Typography: Story = { args: { category: 'typography' } };
export const Spacing: Story = { args: { category: 'spacing' } };
export const Radius: Story = { args: { category: 'radius' } };
export const Shadows: Story = { args: { category: 'shadow' } };
export const Motion: Story = { args: { category: 'motion' } };
