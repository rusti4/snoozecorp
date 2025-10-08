// SnoozeCorp Content Script for Firefox
// Immediately blocks News Corp sites by replacing document content

(function() {
  'use strict';

  console.log('🚫 SnoozeCorp: Content script loaded on', window.location.hostname);

  // Run immediately at document_start
  blockPage();

  function blockPage() {
    console.log('🚫 SnoozeCorp: Blocking page for', window.location.hostname);

    // Stop all network requests and page loading immediately
    window.stop();
    
    // Clear any existing content
    document.documentElement.innerHTML = '';
    
    // Replace with blocked page
    document.open();
    document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Site Blocked</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #111;
          color: white;
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 600px;
          background-color: #222;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 3px solid #ff4444;
          text-align: center;
        }
        h1 {
          font-size: 3em;
          margin-bottom: 20px;
          color: #ff4444;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        p {
          font-size: 1.3em;
          margin-bottom: 25px;
          line-height: 1.4;
        }
        .description {
          font-size: 1em;
          opacity: 0.9;
          margin-bottom: 35px;
        }
        .buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        button {
          padding: 12px 24px;
          font-size: 1em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-weight: bold;
        }
        .back-btn {
          background-color: #666;
          color: white;
        }
        .back-btn:hover {
          background-color: #888;
        }
        .continue-btn {
          background-color: #ff4444;
          color: white;
        }
        .continue-btn:hover {
          background-color: #cc0000;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚫 Site Blocked</h1>
        <p><strong>${window.location.hostname}</strong> is owned by News Corp (Rupert Murdoch) and has been blocked by SnoozeCorp.</p>
        <p class="description">This extension helps you avoid supporting Murdoch-owned media companies.</p>
        <div class="buttons">
          <button class="back-btn" onclick="history.back()">← Go Back</button>
          <button class="continue-btn" onclick="window.location.href = window.location.href.replace('https://', 'https://continue-to-') + '?bypass=snoozecorp'">Continue Anyway →</button>
        </div>
      </div>
    </body>
    </html>
    `);
    document.close();

    // Prevent any further loading
    window.stop();
  }
})();