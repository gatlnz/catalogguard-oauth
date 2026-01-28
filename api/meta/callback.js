export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI)}&code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Get long-lived token
      const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${tokenData.access_token}`;
      
      const longLivedResponse = await fetch(longLivedUrl);
      const longLivedData = await longLivedResponse.json();

      const finalToken = longLivedData.access_token || tokenData.access_token;

      // Get ad accounts
      const adAccountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${finalToken}&fields=id,name,account_status`);
      const adAccountsData = await adAccountsResponse.json();

      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CatalogGuard - Meta Connected!</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #0f172a;
              color: #e2e8f0;
            }
            .success { 
              background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);
            }
            .success h1 {
              color: #dbeafe;
              margin: 0;
              font-size: 28px;
            }
            .instructions {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 20px;
            }
            .instructions h2 {
              color: #2dd4bf;
              font-size: 18px;
              margin-bottom: 15px;
            }
            .instructions ol {
              color: #94a3b8;
              padding-left: 20px;
              line-height: 1.8;
            }
            .instructions strong {
              color: #e2e8f0;
            }
            .token-section {
              margin: 30px 0;
            }
            .token-section label {
              color: #94a3b8;
              font-size: 14px;
              display: block;
              margin-bottom: 8px;
            }
            .token-box { 
              background: #1e293b;
              padding: 15px;
              border-radius: 8px;
              word-break: break-all;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #2dd4bf;
              border: 1px solid rgba(45, 212, 191, 0.2);
              margin-bottom: 12px;
              max-height: 120px;
              overflow-y: auto;
            }
            .copy-btn { 
              background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-size: 14px;
              font-family: 'DM Sans', sans-serif;
              transition: transform 0.2s, box-shadow 0.2s;
              width: 100%;
            }
            .copy-btn:hover { 
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(13, 148, 136, 0.3);
            }
            .copy-btn.copied {
              background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            }
            .ad-accounts {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 20px;
              border-radius: 12px;
              margin: 30px 0;
            }
            .ad-accounts h3 {
              color: #2dd4bf;
              font-size: 16px;
              margin-bottom: 15px;
            }
            .ad-account { 
              background: #1e293b;
              padding: 15px;
              border-radius: 8px;
              margin: 10px 0;
              border: 1px solid rgba(45, 212, 191, 0.1);
            }
            .ad-account strong {
              color: #e2e8f0;
              display: block;
              margin-bottom: 5px;
            }
            .ad-account-id {
              color: #94a3b8;
              font-size: 14px;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background: rgba(45, 212, 191, 0.1);
              border-left: 3px solid #2dd4bf;
              padding: 15px 20px;
              border-radius: 6px;
              margin-top: 30px;
              font-size: 14px;
              color: #94a3b8;
              line-height: 1.6;
            }
            .info-box strong {
              color: #2dd4bf;
              display: block;
              margin-bottom: 8px;
            }
            .close-note {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              color: #64748b;
              font-size: 14px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✓ Meta Connected!</h1>
          </div>

          <div class="instructions">
            <h2>📋 Next Steps:</h2>
            <ol>
              <li>Copy your access token below</li>
              <li>Copy your ad account ID from below</li>
              <li>Go to your CatalogGuard dashboard</li>
              <li>Open the <strong>Config</strong> tab</li>
              <li>Paste the token into cell <strong>B6</strong> (Meta Access Token)</li>
              <li>Paste the ad account ID into cell <strong>B7</strong> (Meta Ad Account ID)</li>
            </ol>
          </div>
          
          <div class="token-section">
            <label>Your Meta Access Token:</label>
            <div class="token-box" id="token">${finalToken}</div>
            <button class="copy-btn" id="copyTokenBtn" onclick="copyToken()">📋 Copy Token</button>
          </div>
          
          <div class="ad-accounts">
            <h3>Your Ad Accounts:</h3>
            ${adAccountsData.data && adAccountsData.data.length > 0 ? adAccountsData.data.map((acc, i) => `
              <div class="ad-account">
                <strong>${acc.name}</strong>
                <div class="ad-account-id" id="account-${i}">${acc.id.replace('act_', '')}</div>
                <button class="copy-btn" style="margin-top: 10px; font-size: 12px; padding: 8px 16px;" onclick="copyAccountId('${acc.id.replace('act_', '')}', ${i})">📋 Copy This ID</button>
              </div>
            `).join('') : '<p style="color: #94a3b8;">No ad accounts found</p>'}
          </div>

          <div class="info-box">
            <strong>💡 Lost your token?</strong>
            Just click "Connect Meta" again from the setup page - you'll get a fresh token instantly. The old one will stop working.
          </div>
          
          <p class="close-note">You can close this window after copying your token and ad account ID</p>

          <div style="text-align: center; margin-top: 20px;">
            <a href="/setup" style="display: inline-block; padding: 12px 24px; background: rgba(45, 212, 191, 0.1); color: #2dd4bf; text-decoration: none; border-radius: 8px; font-weight: 600; border: 1px solid rgba(45, 212, 191, 0.3);">
              ← Back to Setup Guide
            </a>
          </div>

          <script>
            function copyToken() {
              const token = document.getElementById('token').innerText;
              navigator.clipboard.writeText(token).then(() => {
                const btn = document.getElementById('copyTokenBtn');
                btn.innerHTML = '✓ Token Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                  btn.innerHTML = '📋 Copy Token';
                  btn.classList.remove('copied');
                }, 3000);
              });
            }

            function copyAccountId(id, index) {
              navigator.clipboard.writeText(id).then(() => {
                const btns = document.querySelectorAll('.ad-account .copy-btn');
                btns.forEach((btn, i) => {
                  if (i === index) {
                    btn.innerHTML = '✓ ID Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                      btn.innerHTML = '📋 Copy This ID';
                      btn.classList.remove('copied');
                    }, 3000);
                  }
                });
              });
            }
          </script>
        </body>
        </html>
      `);
    } else {
      throw new Error(tokenData.error?.message || 'Failed to get access token');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
