// SnoozeCorp Popup Script
// Handles UI for viewing domains and submitting new ones

/* eslint-disable no-unused-vars */

// Import browser API polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

// Hardcoded News Corp domains (same as background.js)
const NEWS_CORP_DOMAINS = [
  'bestrecipes.com.au',
  'hipages.com.au',
  'odds.com.au',
  'onebigswitch.com.au',
  'suddenly.com.au',
  'supercoach.com.au',
  'punters.com.au',
  'skyweather.com.au',
  'skynews.com.au',
  'australiannewschannel',
  'kayosports.com.au',
  'foxtel.com.au',
  'newscorp.com',
  'news.com.au',
  'foxnews.com',
  'foxnewsgo.com',
  'foxbusiness.com',
  'foxsports.com',
  'thetimes.co.uk',
  'thesundaytimes.co.uk',
  'thesun.co.uk',
  'news.co.uk',
  'dowjones.com',
  'nypost.com',
  'harpercollins.com',
  'amplify.com',
  'newsamerica.com',
  'smartsource.com',
  'storyful.com',
  'theaustralian.com.au',
  'foxsports.com.au',
  'foxsportspulse.com',
  'businessspectator.com.au',
  'eurekareport.com.au',
  'vogue.com.au',
  'taste.com.au',
  'kidspot.com.au',
  'bodyandsoul.com.au',
  'homelife.com.au',
  'dailytelegraph.com.au',
  'couriermail.com.au',
  'heraldsun.com.au',
  'adelaidenow.com.au',
  'perthnow.com.au',
  'ntnews.com.au',
  'themercury.com.au',
  'townsvillebulletin.com.au',
  'cairnspost.com.au',
  'goldcoastbulletin.com.au',
  'hgeelongadvertiser.com.au',
  'geelongadvertiser.com.au',
  'weeklytimesnow.com.au',
  'whereilive.com.au',
  'moshtix.com.au',
  'foxtix.com.au',
  'getprice.com.au',
  'shopferret.com.au',
  'realcommercial.com.au',
  'wego.com.au',
  'learningseat.com.au',
  'stocksinvalue.com.au',
  'traderoo.com.au',
  'careerone.com.au',
  'carsguide.com.au',
  'realestate.com.au'
];

// DOM elements
const domainList = document.getElementById('domain-list');
const submitForm = document.getElementById('submit-form');
const domainInput = document.getElementById('domain-input');
const messageDiv = document.getElementById('message');

// Function to validate URL/domain
function validateDomain(domain) {
  // Trim whitespace
  domain = domain.trim().toLowerCase();

  // Check for basic format
  if (!domain || domain.length === 0) {
    return { valid: false, error: 'Domain cannot be empty' };
  }

  // Check for suspicious characters (basic check)
  if (/[<>'"&]/.test(domain)) {
    return { valid: false, error: 'Domain contains invalid characters' };
  }

  // Check for IP addresses
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipRegex.test(domain)) {
    return { valid: false, error: 'IP addresses are not allowed' };
  }

  // Check for embedded credentials
  if (domain.includes('@')) {
    return { valid: false, error: 'Credentials in domain are not allowed' };
  }

  // Check for unusual ports
  if (domain.includes(':')) {
    return { valid: false, error: 'Ports in domain are not allowed' };
  }

  // Check for non-HTTPS protocols (if full URL)
  if (domain.startsWith('http://') || domain.startsWith('ftp://') || domain.startsWith('file://')) {
    return { valid: false, error: 'Only HTTPS domains are allowed' };
  }

  // Try to construct URL to validate
  try {
    const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`);
    const hostname = url.hostname;

    // Check for punycode/IDN suspicious domains
    if (hostname.includes('xn--')) {
      return { valid: false, error: 'Internationalized domain names are not allowed' };
    }

    // Check if it's already in the list
    if (NEWS_CORP_DOMAINS.includes(hostname) ||
        NEWS_CORP_DOMAINS.some(d => hostname.endsWith('.' + d))) {
      return { valid: false, error: 'Domain is already blocked' };
    }

    // Basic check for plausible media/news site
    const tlds = ['.com', '.org', '.net', '.edu', '.gov', '.au', '.uk', '.ca', '.de', '.fr'];
    const hasValidTld = tlds.some(tld => hostname.endsWith(tld));
    if (!hasValidTld && !hostname.includes('.')) {
      return { valid: false, error: 'Domain appears invalid' };
    }

    return { valid: true, domain: hostname };
  } catch (_e) {
    return { valid: false, error: 'Invalid domain format' };
  }
}

// Function to display domains
async function displayDomains() {
  // Clear existing
  domainList.innerHTML = '';

  // Add hardcoded domains
  NEWS_CORP_DOMAINS.forEach(domain => {
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.textContent = domain;
    domainList.appendChild(div);
  });

  // Add user-submitted domains
  try {
    const result = await browser.storage.local.get('userSubmittedDomains');
    const userDomains = result.userSubmittedDomains || [];
    userDomains.forEach(domain => {
      const div = document.createElement('div');
      div.className = 'domain-item';
      div.textContent = `${domain} (pending review)`;
      domainList.appendChild(div);
    });
  } catch (_e) {
    // Ignore errors
  }
}

// Function to show message
function showMessage(text, type = 'error') {
  messageDiv.textContent = text;
  messageDiv.className = type;
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 5000);
}

// Handle form submission
submitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const domain = domainInput.value.trim();

  const validation = validateDomain(domain);
  if (!validation.valid) {
    showMessage(validation.error, 'error');
    return;
  }

  try {
    // Get existing submissions
    const result = await browser.storage.local.get('userSubmittedDomains');
    const userDomains = result.userSubmittedDomains || [];

    // Check if already submitted
    if (userDomains.includes(validation.domain)) {
      showMessage('Domain already submitted', 'error');
      return;
    }

    // Add to list
    userDomains.push(validation.domain);
    await browser.storage.local.set({ userSubmittedDomains: userDomains });

    // Update display
    await displayDomains();

    // Clear input
    domainInput.value = '';

    // Show success
    showMessage('Domain submitted for review!', 'success');

    // Notify background script to reload
    browser.runtime.sendMessage({ action: 'reloadUserDomains' });

  } catch (_e) {
    showMessage('Error submitting domain', 'error');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', displayDomains);