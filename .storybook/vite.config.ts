import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const source = fileURLToPath(new URL('../examples/service', import.meta.url));
const cssPath = `${source}/styles.css`;
const require = createRequire(import.meta.url);
// Use Vite's existing CSS parser; no extra dependency or copied stylesheet.
const postcss = createRequire(require.resolve('vite'))('postcss');
const styleId = '\0virtual:modu-service.css';
const scope = ':where(.sb-service-root)';

interface Rule {
  selectors: string[];
  parent?: { type: string; name?: string; parent?: Rule['parent'] };
}

function serviceStyles(): Plugin {
  return {
    name: 'modu-service-preview-styles',
    resolveId: (id) => id === 'virtual:modu-service.css' ? styleId : undefined,
    load(id) {
      if (id !== styleId) return;
      this.addWatchFile(cssPath);
      const root = postcss.parse(readFileSync(cssPath, 'utf8'));
      root.walkRules((rule: Rule) => {
        let parent = rule.parent;
        while (parent) {
          if (parent.type === 'atrule' && parent.name?.endsWith('keyframes')) return;
          parent = parent.parent;
        }
        rule.selectors = rule.selectors.map((selector) =>
          ['html', 'body', '#root'].includes(selector) ? scope
            : selector === '*' ? `${scope}, ${scope} *`
              : `${scope} ${selector}`,
        );
      });
      return root.toString();
    },
  };
}

export default defineConfig({
  plugins: [serviceStyles()],
  resolve: {
    alias: [
      { find: '@design-system', replacement: fileURLToPath(new URL('../src', import.meta.url)) },
      { find: '@modu-service', replacement: source },
    ],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: { allow: [fileURLToPath(new URL('../', import.meta.url))] },
    watch: { ignored: ['**/storybook-static/**'] },
  },
});
