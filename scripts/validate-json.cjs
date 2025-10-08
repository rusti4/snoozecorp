#!/usr/bin/env node

const fs = require('fs');

// Files to validate
const filesToCheck = [
  'package.json',
  'manifest.json',
  '_locales/en_AU/messages.json'
];

let hasErrors = false;

console.log('Validating JSON files...\n');

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} - Valid JSON`);
  } catch (error) {
    console.error(`❌ ${file} - Invalid JSON: ${error.message}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log('\n❌ JSON validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All JSON files are valid!');
}