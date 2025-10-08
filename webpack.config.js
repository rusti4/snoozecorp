import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default () => {
  return {
    entry: {
      content: './src/content.js',
      background: './src/background.js',
      popup: './popup/popup.js',
    },
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'manifest.json',
            to: 'manifest.json',
            transform: (content) => {
              const manifest = JSON.parse(content.toString());
              // Update background script path for built extension
              if (manifest.background && manifest.background.service_worker) {
                manifest.background.service_worker = 'background.js';
              }
              return JSON.stringify(manifest, null, 2);
            }
          },
          { from: 'src/assets', to: 'assets' },
          { from: '_locales', to: '_locales' },
          { from: 'popup', to: 'popup' },
          { from: 'options', to: 'options' },
          { from: 'rules.json', to: 'rules.json' },
          { from: 'src/blocked.html', to: 'blocked.html' },
          { from: 'src/blocked.js', to: 'blocked.js' },
          { from: 'admin.html', to: 'admin.html' },
          { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: 'browser-polyfill.js' },
          { from: 'public', to: '.', noErrorOnMissing: true },
        ],
      }),
    ],
    mode: 'production',
  };
};