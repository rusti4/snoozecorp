// SnoozeCorp Admin Script
// Password-protected admin interface for managing domains

/* global browser */

// Default admin password (in production, this should be configurable)
const ADMIN_PASSWORD = 'snoozecorp2024'; // TODO: Make this configurable

// Hardcoded News Corp domains (will be loaded from storage)
let NEWS_CORP_DOMAINS = [];

/* eslint-disable no-unused-vars */

// DOM elements - only used in admin interface
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');
const hardcodedDomainsTextarea = document.getElementById('hardcoded-domains');
const saveHardcodedBtn = document.getElementById('save-hardcoded');
const addDomainBtn = document.getElementById('add-domain');
const hardcodedMessage = document.getElementById('hardcoded-message');
const aiDomainInput = document.getElementById('ai-domain');
const validateAiBtn = document.getElementById('validate-ai');
const aiResult = document.getElementById('ai-result');
const userDomainsDiv = document.getElementById('user-domains');
const statsDiv = document.getElementById('stats');

// Load hardcoded domains from storage
async function loadHardcodedDomains() {
  try {
    const result = await browser.storage.local.get('hardcodedDomains');
    NEWS_CORP_DOMAINS = result.hardcodedDomains || [
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
    hardcodedDomainsTextarea.value = NEWS_CORP_DOMAINS.join('\n');
  } catch (error) {
    console.error('Error loading hardcoded domains:', error);
    hardcodedMessage.textContent = 'Error loading domains.';
    hardcodedMessage.style.color = 'red';
  }
}

// Save hardcoded domains to storage
async function saveHardcodedDomains() {
  try {
    const domains = hardcodedDomainsTextarea.value
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    await browser.storage.local.set({ hardcodedDomains: domains });
    NEWS_CORP_DOMAINS = domains;

    hardcodedMessage.textContent = 'Domains saved successfully!';
    hardcodedMessage.style.color = 'green';

    // Update background script
    await browser.runtime.sendMessage({ action: 'updateDomains' });

    setTimeout(() => {
      hardcodedMessage.textContent = '';
    }, 3000);
  } catch (error) {
    console.error('Error saving domains:', error);
    hardcodedMessage.textContent = 'Error saving domains.';
    hardcodedMessage.style.color = 'red';
  }
}

// Add a single domain
function addDomain() {
  const newDomain = prompt('Enter new domain to add:');
  if (newDomain && newDomain.trim()) {
    const domain = newDomain.trim();
    if (!NEWS_CORP_DOMAINS.includes(domain)) {
      NEWS_CORP_DOMAINS.push(domain);
      hardcodedDomainsTextarea.value = NEWS_CORP_DOMAINS.join('\n');
      saveHardcodedDomains();
    } else {
      hardcodedMessage.textContent = 'Domain already exists.';
      hardcodedMessage.style.color = 'orange';
      setTimeout(() => {
        hardcodedMessage.textContent = '';
      }, 3000);
    }
  }
}

// AI domain validation (placeholder - requires API integration)
async function validateDomainWithAI(domain) {
  aiResult.classList.remove('hidden');
  aiResult.innerHTML = '<div class="loading"></div> Validating domain...';

  try {
    // TODO: Replace with actual AI API call
    // For now, simulate AI validation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI response - in reality, this would check if domain belongs to News Corp
    const isNewsCorp = Math.random() > 0.5; // Random for demo

    aiResult.innerHTML = `
      <strong>Domain:</strong> ${domain}<br>
      <strong>AI Analysis:</strong> ${isNewsCorp ? 'Likely News Corp owned' : 'Not identified as News Corp owned'}<br>
      <strong>Confidence:</strong> ${Math.floor(Math.random() * 40 + 60)}%<br>
      <strong>Recommendation:</strong> ${isNewsCorp ? 'Add to blocked list' : 'Monitor for changes'}
    `;
  } catch (error) {
    aiResult.innerHTML = `Error validating domain: ${error.message}`;
  }
}

// Display user-submitted domains with approval/rejection actions
async function displayUserDomains() {
  userDomainsDiv.innerHTML = '';
  try {
    const result = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains', 'rejectedDomains']);
    const userDomains = result.userSubmittedDomains || [];
    const approvedDomains = result.approvedDomains || [];
    const rejectedDomains = result.rejectedDomains || [];

    if (userDomains.length === 0) {
      userDomainsDiv.innerHTML = '<p>No pending user submissions.</p>';
      return;
    }

    userDomains.forEach((domain, index) => {
      const div = document.createElement('div');
      div.className = 'domain-item';

      const domainText = document.createElement('span');
      domainText.textContent = domain;

      const actions = document.createElement('div');
      actions.className = 'domain-actions';

      const approveBtn = document.createElement('button');
      approveBtn.className = 'success';
      approveBtn.textContent = '✓ Approve';
      approveBtn.onclick = () => approveDomain(domain, index);

      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'danger';
      rejectBtn.textContent = '✗ Reject';
      rejectBtn.onclick = () => rejectDomain(domain, index);

      actions.appendChild(approveBtn);
      actions.appendChild(rejectBtn);

      div.appendChild(domainText);
      div.appendChild(actions);
      userDomainsDiv.appendChild(div);
    });

    // Show approved and rejected counts
    const approvedDiv = document.createElement('div');
    approvedDiv.innerHTML = `<p><strong>Approved:</strong> ${approvedDomains.length} domains</p>`;
    userDomainsDiv.appendChild(approvedDiv);

    const rejectedDiv = document.createElement('div');
    rejectedDiv.innerHTML = `<p><strong>Rejected:</strong> ${rejectedDomains.length} domains</p>`;
    userDomainsDiv.appendChild(rejectedDiv);

  } catch (error) {
    console.error('Error loading user domains:', error);
    userDomainsDiv.innerHTML = '<p>Error loading user submissions.</p>';
  }
}

// Approve a user-submitted domain
async function approveDomain(domain, index) {
  try {
    const result = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains']);
    const userDomains = result.userSubmittedDomains || [];
    const approvedDomains = result.approvedDomains || [];

    // Remove from pending
    userDomains.splice(index, 1);

    // Add to approved and hardcoded list
    approvedDomains.push(domain);
    NEWS_CORP_DOMAINS.push(domain);

    // Save changes
    await browser.storage.local.set({
      userSubmittedDomains: userDomains,
      approvedDomains: approvedDomains,
      hardcodedDomains: NEWS_CORP_DOMAINS
    });

    // Update UI
    hardcodedDomainsTextarea.value = NEWS_CORP_DOMAINS.join('\n');
    displayUserDomains();
    await browser.runtime.sendMessage({ action: 'updateDomains' });

  } catch (error) {
    console.error('Error approving domain:', error);
  }
}

// Reject a user-submitted domain
async function rejectDomain(domain, index) {
  try {
    const result = await browser.storage.local.get(['userSubmittedDomains', 'rejectedDomains']);
    const userDomains = result.userSubmittedDomains || [];
    const rejectedDomains = result.rejectedDomains || [];

    // Remove from pending
    userDomains.splice(index, 1);

    // Add to rejected
    rejectedDomains.push(domain);

    // Save changes
    await browser.storage.local.set({
      userSubmittedDomains: userDomains,
      rejectedDomains: rejectedDomains
    });

    displayUserDomains();

  } catch (error) {
    console.error('Error rejecting domain:', error);
  }
}

// Display statistics
async function displayStats() {
  try {
    const result = await browser.storage.local.get(['userSubmittedDomains', 'approvedDomains', 'rejectedDomains']);
    const pending = (result.userSubmittedDomains || []).length;
    const approved = (result.approvedDomains || []).length;
    const rejected = (result.rejectedDomains || []).length;
    const totalHardcoded = NEWS_CORP_DOMAINS.length;

    statsDiv.innerHTML = `
      <p><strong>Total Hardcoded Domains:</strong> ${totalHardcoded}</p>
      <p><strong>Pending User Submissions:</strong> ${pending}</p>
      <p><strong>Approved User Submissions:</strong> ${approved}</p>
      <p><strong>Rejected User Submissions:</strong> ${rejected}</p>
    `;
  } catch (error) {
    console.error('Error loading stats:', error);
    statsDiv.innerHTML = '<p>Error loading statistics.</p>';
  }
}

// Login functionality
function login() {
  const password = passwordInput.value;
  if (password === ADMIN_PASSWORD) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loadHardcodedDomains();
    displayUserDomains();
    displayStats();
  } else {
    loginMessage.textContent = 'Incorrect password.';
    loginMessage.style.color = 'red';
  }
}

// Show blocked page instead of admin interface
function showBlockedPage(domain) {
  document.body.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.95);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2147483647;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div style="
        max-width: 600px;
        background-color: #222;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 3px solid #ff4444;
      ">
        <h1 style="
          font-size: 3em;
          margin-bottom: 20px;
          color: #ff4444;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        ">🚫 Site Blocked</h1>

        <p style="
          font-size: 1.3em;
          margin-bottom: 25px;
          line-height: 1.4;
        ">
          <strong>${domain || 'This site'}</strong> is owned by News Corp (Rupert Murdoch) and has been blocked by SnoozeCorp.
        </p>

        <p style="
          font-size: 1em;
          opacity: 0.9;
          margin-bottom: 35px;
        ">
          This extension helps you avoid supporting Murdoch-owned media companies.
        </p>

        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button onclick="goBack()" style="
            padding: 12px 24px;
            font-size: 1em;
            background-color: #666;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-weight: bold;
          " onmouseover="this.style.backgroundColor='#888'" onmouseout="this.style.backgroundColor='#666'">
            ← Go Back
          </button>

          <button onclick="continueAnyway('${domain}')" style="
            padding: 12px 24px;
            font-size: 1em;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-weight: bold;
          " onmouseover="this.style.backgroundColor='#cc3333'" onmouseout="this.style.backgroundColor='#ff4444'">
            Continue Anyway
          </button>
        </div>

        <p style="
          font-size: 0.8em;
          opacity: 0.6;
          margin-top: 25px;
        ">
          To manage blocked domains or submit new ones, click the SnoozeCorp icon in your browser toolbar.
        </p>
      </div>
    </div>
  `;
}

// Go back to previous page
function goBack() {
  window.history.back();
}

// Continue to the blocked site
async function continueAnyway(domain) {
  if (!domain) return;

  try {
    // Temporarily disable blocking for this domain
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [getDomainRuleId(domain)]
    });

    // Navigate to the original URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const targetDomain = params.get('domain');

    if (targetDomain) {
      // Re-enable blocking after a short delay
      setTimeout(async () => {
        await browser.runtime.sendMessage({ action: 'updateDomains' });
      }, 1000);

      // Navigate to the actual site
      window.location.href = 'https://' + targetDomain;
    }
  } catch (error) {
    console.error('Error continuing to site:', error);
  }
}

// Get rule ID for a domain (simple hash function)
function getDomainRuleId(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    const char = domain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 1000 + 1; // Keep within reasonable range
}

// Initialize admin interface
async function initializeAdminInterface() {
  await loadHardcodedDomains();
  await displayUserDomains();
  await displayStats();

  // Set up event listeners
  loginBtn.addEventListener('click', login);
  saveHardcodedBtn.addEventListener('click', saveHardcodedDomains);
  addDomainBtn.addEventListener('click', addDomain);
  validateAiBtn.addEventListener('click', () => validateDomainWithAI(aiDomainInput.value));

  // Show login section initially
  loginSection.style.display = 'block';
  adminSection.style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  // Check if this is a blocked page redirect
  const urlParams = new URLSearchParams(window.location.search);
  const isBlocked = urlParams.get('blocked');
  const blockedDomain = urlParams.get('domain');

  if (isBlocked === 'true' && blockedDomain) {
    // Show the blocked page overlay
    showBlockedPage(blockedDomain);
    return;
  }

  // Otherwise, show the admin interface
  await initializeAdminInterface();
});