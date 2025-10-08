// SnoozeCorp Background Script
// Handles tab monitoring, domain checking, and badge updates

console.log('🚀 SnoozeCorp background script STARTING...');

// Import browser API polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

console.log('📦 Polyfill loaded, continuing...');

// Known News Corp domains (loaded from storage, with defaults)
let NEWS_CORP_DOMAINS = [
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

// Load hardcoded domains from storage
async function loadHardcodedDomains() {
  try {
    const result = await browser.storage.local.get('hardcodedDomains');
    if (result.hardcodedDomains && result.hardcodedDomains.length > 0) {
      NEWS_CORP_DOMAINS = result.hardcodedDomains;
    }
  } catch (error) {
    console.error('Error loading hardcoded domains:', error);
  }
}

// User-submitted domains (loaded from storage)
let userSubmittedDomains = [];

// Function to check if a URL matches News Corp domains
function isNewsCorpDomain(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    console.log('🔍 CHECKING DOMAIN:', hostname, 'from URL:', url);

    // Check against hardcoded list
    const isHardcoded = NEWS_CORP_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    console.log('🔍 HARDCODED MATCH:', isHardcoded);

    if (isHardcoded) {
      return true;
    }

    // Check against user-submitted domains
    const isUserSubmitted = userSubmittedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    console.log('Is user submitted match:', isUserSubmitted);

    return isUserSubmitted;
  } catch (error) {
    console.error('Error parsing URL:', url, error);
    return false;
  }
}

// Function to update badge for a tab
async function updateBadge(tabId, isBlocked) {
  try {
    if (isBlocked) {
      await browser.action.setBadgeText({ tabId, text: '🛑' });
      await browser.action.setBadgeBackgroundColor({ tabId, color: '#ff0000' });
    } else {
      await browser.action.setBadgeText({ tabId, text: '' });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
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

// Listen for tab updates to block News Corp sites
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Block News Corp sites before they load
  if (changeInfo.status === 'loading' && tab.url && tab.url !== browser.runtime.getURL('blocked.html')) {
    try {
      const url = new URL(tab.url);
      if (isNewsCorpDomain(tab.url)) {
        console.log('🚫 Blocking News Corp site:', url.hostname);
        const blockedUrl = browser.runtime.getURL(`blocked.html?domain=${encodeURIComponent(url.hostname)}`);
        await browser.tabs.update(tabId, { url: blockedUrl });
        return;
      }
    } catch {
      // Invalid URL, ignore
    }
  }
  
  // Update badge when page is complete
  if (changeInfo.status === 'complete' && tab.url) {
    const isBlocked = isNewsCorpDomain(tab.url);
    console.log('Tab update:', tab.url, 'isBlocked:', isBlocked);
    await updateBadge(tabId, isBlocked);
  }
});

// Initialize on startup
browser.runtime.onStartup.addListener(async () => {
  console.log('SnoozeCorp: onStartup triggered');
  await loadHardcodedDomains();
  await loadUserSubmissions();
});

// Initialize on install
browser.runtime.onInstalled.addListener(async () => {
  console.log('SnoozeCorp: onInstalled triggered');
  await loadHardcodedDomains();
  await loadUserSubmissions();
});

// Listen for storage changes to reload domains
browser.storage.onChanged.addListener(async (changes) => {
  if (changes.userSubmittedDomains) {
    userSubmittedDomains = changes.userSubmittedDomains.newValue || [];
  }
  if (changes.hardcodedDomains || changes.approvedDomains) {
    // Reload domains and update DNR rules
    await loadHardcodedDomains();
  }
});

// Listen for messages from popup and options
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('📨 Received message:', message);

  try {
    switch (message.action) {
      case 'ping': {
        sendResponse({ success: true, version: '1.0.0' });
        break;
      }

      case 'getHardcodedDomains': {
        const hardcodedResult = await browser.storage.local.get('hardcodedDomains');
        const hardcodedDomains = hardcodedResult.hardcodedDomains || NEWS_CORP_DOMAINS;
        sendResponse({ domains: hardcodedDomains });
        break;
      }

      case 'setHardcodedDomains': {
        await browser.storage.local.set({ hardcodedDomains: message.domains });
        NEWS_CORP_DOMAINS = message.domains;
        // Note: updateBlockingRules removed - using programmatic blocking now
        sendResponse({ success: true });
        break;
      }

      case 'getUserDomains': {
        const userResult = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains', 'rejectedDomains']);
        sendResponse({
          userDomains: userResult.userSubmittedDomains || [],
          approvedDomains: userResult.approvedDomains || [],
          rejectedDomains: userResult.rejectedDomains || []
        });
        break;
      }

      case 'approveDomain': {
        const approveResult = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains']);
        const userDomains = approveResult.userSubmittedDomains || [];
        const approvedDomains = approveResult.approvedDomains || [];

        // Remove from pending
        userDomains.splice(message.index, 1);

        // Add to approved
        approvedDomains.push(message.domain);
        NEWS_CORP_DOMAINS.push(message.domain);

        await browser.storage.local.set({
          userSubmittedDomains: userDomains,
          approvedDomains: approvedDomains
        });

        // Note: updateBlockingRules removed - using programmatic blocking now
        sendResponse({ success: true });
        break;
      }

      case 'rejectDomain': {
        const rejectResult = await browser.storage.local.get(['userSubmittedDomains', 'rejectedDomains']);
        const rejectUserDomains = rejectResult.userSubmittedDomains || [];
        const rejectedDomains = rejectResult.rejectedDomains || [];

        // Remove from pending
        rejectUserDomains.splice(message.index, 1);

        // Add to rejected
        rejectedDomains.push(message.domain);

        await browser.storage.local.set({
          userSubmittedDomains: rejectUserDomains,
          rejectedDomains: rejectedDomains
        });

        sendResponse({ success: true });
        break;
      }

      case 'getStats': {
        const statsResult = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains', 'rejectedDomains']);
        sendResponse({
          totalHardcoded: NEWS_CORP_DOMAINS.length,
          pending: (statsResult.userSubmittedDomains || []).length,
          approved: (statsResult.approvedDomains || []).length,
          rejected: (statsResult.rejectedDomains || []).length
        });
        break;
      }

      case 'reloadUserDomains': {
        await loadUserSubmissions();
        sendResponse({ success: true });
        break;
      }

      case 'updateDomains': {
        await loadHardcodedDomains();
        sendResponse({ success: true });
        break;
      }

      default: {
        sendResponse({ error: 'Unknown action' });
      }
    }
  } catch (err) {
    console.error('❌ Message handling error:', err);
    sendResponse({ error: err.message });
  }

  return true; // Keep message channel open for async responses
});