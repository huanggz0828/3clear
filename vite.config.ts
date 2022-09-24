import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default ({ mode }: any) =>
  defineConfig({
    base: mode === 'production' ? 'https://huang-guanzhong.gitee.io/3clear/' : '/',
    plugins: [solidPlugin()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/base.less')}";`,
        },
      },
    },
    server: {
      port: 8080,
    },
    build: {
      target: 'esnext',
    },
  });
