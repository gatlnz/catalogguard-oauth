export default async function handler(req, res) {
  const { code, shop, state } = req.query;

  if (!code || !shop) {
    return res.status(400).send('Missing code or shop parameter');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Success page - show the token to copy
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CatalogGuard - Connected!</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
            .success { background: #065f46; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .token-box { background: #1e293b; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 14px; }
            h1 { color: #2dd4bf; }
            .copy-btn { background: #2dd4bf; color: #0f172a; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 15px; font-weight: bold; }
            .copy-btn:hover { background: #5eead4; }
            .shop-name { color: #94a3b8; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✓ Shopify Connected!</h1>
            <p class="shop-name">Shop: ${shop}</p>
          </div>
          <p>Copy your access token below and paste it into CatalogGuard:</p>
          <div class="token-box" id="token">${tokenData.access_token}</div>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('token').innerText); this.innerText='Copied!';">Copy Token</button>
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">You can close this window after copying your token.</p>
        </body>
        </html>
      `);
    } else {
      throw new Error(tokenData.error || 'Failed to get access token');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
