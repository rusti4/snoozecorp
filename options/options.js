// SnoozeCorp Options Script
// Displays information and user submissions

/* eslint-disable no-unused-vars */

// Import browser API polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

// Hardcoded News Corp domains
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
const blockedDomainsDiv = document.getElementById('blocked-domains');
const userDomainsDiv = document.getElementById('user-domains');

// Function to display blocked domains
function displayBlockedDomains() {
  blockedDomainsDiv.innerHTML = '';
  NEWS_CORP_DOMAINS.forEach(domain => {
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.textContent = domain;
    blockedDomainsDiv.appendChild(div);
  });
}

// Function to display user domains
async function displayUserDomains() {
  userDomainsDiv.innerHTML = '';
  try {
    const result = await browser.storage.local.get('userSubmittedDomains');
    const userDomains = result.userSubmittedDomains || [];
    if (userDomains.length === 0) {
      userDomainsDiv.textContent = 'No user-submitted domains pending review.';
    } else {
      userDomains.forEach(domain => {
        const div = document.createElement('div');
        div.className = 'domain-item pending';
        div.textContent = domain;
        userDomainsDiv.appendChild(div);
      });
    }
  } catch (_e) {
    userDomainsDiv.textContent = 'Error loading user domains.';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayBlockedDomains();
  displayUserDomains();
});