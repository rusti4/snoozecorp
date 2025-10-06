import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default (env) => {
  const browser = env.browser || 'chrome'; // default to chrome

  return {
    entry: {
      content: './src/content.js',
    },
    output: {
      path: path.resolve(process.cwd(), 'dist', browser),
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
              // Add browser-specific overrides here if needed
              if (browser === 'firefox') {
                // Firefox-specific changes
                manifest.browser_specific_settings = {
                  gecko: {
                    id: "snoozecorp@matcarpenter"
                  }
                };
              }
              return JSON.stringify(manifest, null, 2);
            }
          },
          { from: 'src/assets', to: 'assets' },
          { from: '_locales', to: '_locales' },
          { from: 'public', to: '.', noErrorOnMissing: true },
        ],
      }),
    ],
    mode: 'production',
  };
};