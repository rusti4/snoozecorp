# SnoozeCorp

A browser extension that blocks websites owned by News Corp and its subsidiaries,
including Fox News, Wall Street Journal, and other Murdoch-controlled media outlets.

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
- `_locales/` - Localization files

## Localization

This extension uses Crowdin for translation management.

### Setup

1. Create a project on [Crowdin](https://crowdin.com).
2. Get your Project ID from the API section in Crowdin.
3. Generate a Personal Access Token in your Crowdin account settings.
4. In your GitHub repository, go to Settings > Secrets and variables > Actions.
5. Add the following secrets:
   - `CROWDIN_PROJECT_ID`: Your Crowdin project ID
   - `CROWDIN_PERSONAL_TOKEN`: Your Crowdin personal token
6. Update `crowdin.yml` with your actual Project ID and Personal Token (replace placeholders).
7. Push changes to trigger the Crowdin workflow.

The GitHub Action will automatically upload source strings and download translations.

## License

MIT
