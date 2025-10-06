# SnoozeCorp

A privacy-first browser extension that blocks websites owned by News Corp and its subsidiaries,
including Fox News, Wall Street Journal, and other Murdoch-controlled media outlets.

## Features

- **Privacy-Focused**: Only checks the current tab URL, no browsing history collection or external data transmission
- **Cross-Browser**: Compatible with Chrome and Firefox using Manifest V3 and webextension-polyfill
- **User Submissions**: Secure UI for submitting additional domains for review
- **Local Storage**: User-submitted domains stored locally pending manual review
- **Secure Validation**: Comprehensive URL validation following OWASP guidelines
- **Minimal Permissions**: Only activeTab, storage, and scripting permissions

## Installation

### Chrome

1. Run `npm run build:chrome`
2. Load the `dist/chrome` folder as an unpacked extension in Chrome.

### Firefox

1. Run `npm run build:firefox`
2. Load the `dist/firefox` folder as a temporary add-on in Firefox.

## Usage

- The extension automatically checks the current tab URL against known News Corp domains
- A red badge (🚫) appears on the extension icon when visiting a blocked site
- Click the extension icon to view blocked domains and submit new ones for review
- Access options page for detailed information about blocked and pending domains

## Development

- `npm install`
- `npm run dev` for development build with watch
- `npm run build` for production build
- `npm test` to run E2E tests with Playwright
- `npm run lint` to check code quality
- `npm run lint:fix` to auto-fix linting issues

## Testing

- `npm test` - Run E2E tests with Playwright
- `npm run test:ui` - Run tests with Playwright UI mode

The tests verify basic functionality and can be extended for full extension testing.

- `npm run build:chrome` - Build for Chrome
- `npm run build:firefox` - Build for Firefox (adds Firefox-specific manifest settings)
- `npm run test:watch` - Run tests in watch mode
- `npm run clean` - Clean dist folder
- `npm run lint` - Lint JavaScript files
- `npm run lint:fix` - Auto-fix JavaScript linting issues
- `npm run lint:json` - Lint JSON files
- `npm run lint:yaml` - Lint YAML files
- `npm run lint:md` - Lint Markdown files
- `npm run lint:all` - Run all linting checks

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
