import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

async function callPerplexityAPI(prompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro', // Use appropriate model
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant specializing in media companies and their digital properties. Provide accurate, factual information about News Corp and its subsidiaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1, // Low temperature for factual responses
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function extractDomains(text) {
  // Extract domain names from text using regex
  const domainRegex = /\b([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b/g;
  const matches = text.match(domainRegex) || [];

  // Filter for likely News Corp domains (exclude common domains)
  const excludeDomains = ['google.com', 'facebook.com', 'twitter.com', 'youtube.com', 'wikipedia.org', 'github.com', 'example.com'];
  const newsCorpDomains = matches.filter(domain =>
    !excludeDomains.includes(domain.toLowerCase()) &&
    !domain.includes('localhost') &&
    !domain.includes('127.0.0.1') &&
    domain.split('.').length >= 2
  );

  return [...new Set(newsCorpDomains)]; // Remove duplicates
}

function updateBackgroundJs(newDomains) {
  const backgroundPath = path.join(__dirname, '../../src/background.js');
  let content = fs.readFileSync(backgroundPath, 'utf8');

  // Find the NEWS_CORP_DOMAINS array
  const arrayRegex = /NEWS_CORP_DOMAINS\s*=\s*\[([\s\S]*?)\];/;
  const match = content.match(arrayRegex);

  if (!match) {
    throw new Error('Could not find NEWS_CORP_DOMAINS array in background.js');
  }

  // Parse existing domains
  const existingDomains = match[1]
    .split(',')
    .map(line => line.trim().replace(/['"]/g, ''))
    .filter(domain => domain.length > 0);

  // Add new domains (avoid duplicates)
  const uniqueNewDomains = newDomains.filter(domain => !existingDomains.includes(domain));

  if (uniqueNewDomains.length === 0) {
    console.log('No new domains to add');
    return false;
  }

  // Create updated array
  const updatedDomains = [...existingDomains, ...uniqueNewDomains];
  const updatedArray = updatedDomains.map(domain => `  '${domain}'`).join(',\n');
  const newArrayDeclaration = `NEWS_CORP_DOMAINS = [\n${updatedArray}\n];`;

  // Replace in content
  content = content.replace(arrayRegex, newArrayDeclaration);

  // Write back
  fs.writeFileSync(backgroundPath, content, 'utf8');

  console.log(`Added ${uniqueNewDomains.length} new domains:`, uniqueNewDomains);
  return true;
}

async function main() {
  try {
    console.log('🤖 Starting AI domain update with Perplexity...');

    const prompt = `
Please research and identify any NEW websites, domains, or digital properties that have been acquired by or are owned by News Corporation (News Corp) in the past 6 months.

Focus on:
- Recent acquisitions or mergers
- New brands launched by existing News Corp properties
- Rebranded websites
- New international expansions
- Digital media properties

For each domain you find, provide:
1. The domain name (e.g., example.com)
2. Brief explanation of why it's News Corp owned
3. When it was acquired or launched

Please be thorough but only include domains that are definitively owned by News Corp. If you're unsure, don't include it.

Format your response as a list of domains with explanations.
    `;

    console.log('📡 Calling Perplexity API...');
    const response = await callPerplexityAPI(prompt);

    console.log('🔍 Extracting domains from response...');
    const newDomains = extractDomains(response);

    console.log(`Found ${newDomains.length} potential domains:`, newDomains);

    if (newDomains.length > 0) {
      const updated = updateBackgroundJs(newDomains);
      if (updated) {
        console.log('✅ Successfully updated background.js with new domains');
      }
    } else {
      console.log('ℹ️ No new domains found to add');
    }

  } catch (error) {
    console.error('❌ Error updating domains:', error);
    process.exit(1);
  }
}

main();