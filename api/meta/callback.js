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
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
            .success { background: #065f46; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .token-box { background: #1e293b; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; margin-bottom: 15px; }
            h1 { color: #2dd4bf; margin: 0 0 10px 0; }
            h3 { color: #94a3b8; margin: 20px 0 10px 0; }
            .copy-btn { background: #2dd4bf; color: #0f172a; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
            .copy-btn:hover { background: #5eead4; }
            .ad-account { background: #1e293b; padding: 10px; border-radius: 6px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✓ Meta Connected!</h1>
          </div>
          
          <h3>Your Access Token:</h3>
          <div class="token-box" id="token">${finalToken}</div>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('token').innerText); this.innerText='Copied!';">Copy Token</button>
          
          <h3>Your Ad Accounts:</h3>
          ${adAccountsData.data ? adAccountsData.data.map(acc => `
            <div class="ad-account">
              <strong>${acc.name}</strong><br>
              ID: ${acc.id.replace('act_', '')}
            </div>
          `).join('') : '<p>No ad accounts found</p>'}
          
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">Copy the token and ad account ID into CatalogGuard, then close this window.</p>
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
