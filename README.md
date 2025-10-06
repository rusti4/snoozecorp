# SnoozeCorp

A browser extension that blocks websites owned by News Corp and its subsidiaries, including Fox News, Wall Street Journal, and other Murdoch-controlled media outlets.

## Installation

### Chrome
1. Run `npm run build:chrome`
2. Load the `dist/chrome` folder as an unpacked extension in Chrome.

### Firefox
1. Run `npm run build:firefox`
2. Load the `dist/firefox` folder as a temporary add-on in Firefox.

## Development

- `npm install`
- `npm run dev` for development build with watch
- `npm run build` for production build
- `npm test` to run tests (currently no tests)
- `npm run lint` to check code quality
- `npm run lint:fix` to auto-fix linting issues

## Scripts

- `npm run build:chrome` - Build for Chrome
- `npm run build:firefox` - Build for Firefox (adds Firefox-specific manifest settings)
- `npm run test:watch` - Run tests in watch mode
- `npm run clean` - Clean dist folder

## Structure

- `src/` - Source code
  - `content.js` - Content script
  - `assets/` - Static assets
  - `utils/` - Shared utilities
- `dist/` - Built extensions
- `public/` - Static web assets

## License

MIT