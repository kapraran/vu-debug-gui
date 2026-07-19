import { defineConfig } from 'vite';
import vext from '@vextjs/vite-plugin';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const hasIcons = mode !== 'no-icons';

  return {
    plugins: [vext()],
    build: {
      minify: false,
      sourcemap: true,
    },
    resolve: {
      alias: {
        '#icons': hasIcons
          ? resolve(__dirname, 'src/app/core/tweakpane-shim/icons.ts')
          : resolve(__dirname, 'src/app/core/tweakpane-shim/icons-empty.ts'),
      },
    },
    define: {
      __ICONS__: hasIcons ? 'true' : 'false',
    },
  };
});
