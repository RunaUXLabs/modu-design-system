import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../src/tokens/tokens.css', import.meta.url), new URL('../dist/tokens.css', import.meta.url));
