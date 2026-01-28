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
          <title>CatalogGuard - Shopify Connected!</title>
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
              background: linear-gradient(135deg, #065f46 0%, #047857 100%);
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(6, 95, 70, 0.3);
            }
            .success h1 {
              color: #d1fae5;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .shop-name {
              color: #a7f3d0;
              font-size: 16px;
              opacity: 0.9;
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
              font-size: 13px;
              color: #2dd4bf;
              border: 1px solid rgba(45, 212, 191, 0.2);
              margin-bottom: 12px;
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
            <h1>✓ Shopify Connected!</h1>
            <p class="shop-name">Store: ${shop}</p>
          </div>

          <div class="instructions">
            <h2>📋 Next Steps:</h2>
            <ol>
              <li>Copy your access token below</li>
              <li>Go to your CatalogGuard dashboard</li>
              <li>Open the <strong>Config</strong> tab</li>
              <li>Paste the token into cell <strong>B5</strong> (Shopify Access Token)</li>
              <li>Also paste your store URL <strong>${shop}</strong> into cell <strong>B4</strong></li>
            </ol>
          </div>

          <div class="token-section">
            <label>Your Shopify Access Token:</label>
            <div class="token-box" id="token">${tokenData.access_token}</div>
            <button class="copy-btn" id="copyBtn" onclick="copyToken()">📋 Copy Token</button>
          </div>

          <div class="info-box">
            <strong>💡 Lost your token?</strong>
            Just click "Connect Shopify" again from the setup page - you'll get a fresh token instantly. The old one will stop working.
          </div>

          <p class="close-note">You can close this window after copying your token</p>

          <div style="text-align: center; margin-top: 20px;">
            <a href="/setup" style="display: inline-block; padding: 12px 24px; background: rgba(45, 212, 191, 0.1); color: #2dd4bf; text-decoration: none; border-radius: 8px; font-weight: 600; border: 1px solid rgba(45, 212, 191, 0.3);">
              ← Back to Setup Guide
            </a>
          </div>

          <script>
            function copyToken() {
              const token = document.getElementById('token').innerText;
              navigator.clipboard.writeText(token).then(() => {
                const btn = document.getElementById('copyBtn');
                btn.innerHTML = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                  btn.innerHTML = '📋 Copy Token';
                  btn.classList.remove('copied');
                }, 3000);
              });
            }
          </script>
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
