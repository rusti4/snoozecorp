// SnoozeCorp Background Script
// Handles tab monitoring, domain checking, and badge updates

// Import browser API polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

// Known News Corp domains (hardcoded list)
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

// User-submitted domains (loaded from storage)
let userSubmittedDomains = [];

// Function to check if a URL matches News Corp domains
function isNewsCorpDomain(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  // Check against hardcoded list
  if (NEWS_CORP_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
    return true;
  }
  // Check against user-submitted domains
  if (userSubmittedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
    return true;
  }
  return false;
}

// Function to update badge for a tab
async function updateBadge(tabId, isBlocked) {
  try {
    if (isBlocked) {
      await browser.action.setBadgeText({ tabId, text: '🚫' });
      await browser.action.setBadgeBackgroundColor({ tabId, color: '#ff0000' });
    } else {
      await browser.action.setBadgeText({ tabId, text: '' });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}

// Function to inject content script if not already injected
async function injectContentScript(tabId) {
  try {
    // Check if already injected (simple check, may not be perfect)
    const results = await browser.scripting.executeScript({
      target: { tabId },
      func: () => typeof window.snoozeCorpInjected !== 'undefined'
    });
    if (!results || !results[0] || !results[0].result) {
      await browser.scripting.executeScript({
        target: { tabId },
        files: ['src/content.js']
      });
      // Mark as injected
      await browser.scripting.executeScript({
        target: { tabId },
        func: () => { window.snoozeCorpInjected = true; }
      });
    }
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
}

// Load user-submitted domains from storage
async function loadUserSubmissions() {
  try {
    const result = await browser.storage.local.get('userSubmittedDomains');
    userSubmittedDomains = result.userSubmittedDomains || [];
  } catch (error) {
    console.error('Error loading user submissions:', error);
  }
}

// Listen for tab updates
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isBlocked = isNewsCorpDomain(tab.url);
    await updateBadge(tabId, isBlocked);
    if (isBlocked) {
      await injectContentScript(tabId);
    }
  }
});

// Initialize on startup
browser.runtime.onStartup.addListener(async () => {
  await loadUserSubmissions();
});

// Initialize on install
browser.runtime.onInstalled.addListener(async () => {
  await loadUserSubmissions();
});

// Listen for storage changes to reload user submissions
browser.storage.onChanged.addListener(async (changes) => {
  if (changes.userSubmittedDomains) {
    userSubmittedDomains = changes.userSubmittedDomains.newValue || [];
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'reloadUserDomains') {
    await loadUserSubmissions();
  }
});