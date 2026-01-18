export default function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Deletion - CatalogGuard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
      color: #e2e8f0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container { max-width: 600px; margin: 0 auto; }
    .logo { margin-bottom: 40px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; color: white; }
    h2 { font-size: 20px; font-weight: 600; margin-top: 32px; margin-bottom: 16px; color: #14b8a6; }
    p { color: #94a3b8; margin-bottom: 16px; }
    ul { color: #94a3b8; margin-left: 24px; margin-bottom: 16px; }
    li { margin-bottom: 8px; }
    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 28px;
      margin: 24px 0;
    }
    .email-link { color: #14b8a6; text-decoration: none; font-weight: 600; }
    .email-link:hover { text-decoration: underline; }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.08);
      color: #475569;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0D9488"/>
            <stop offset="100%" style="stop-color:#0F766E"/>
          </linearGradient>
        </defs>
        <path d="M25 2 L45 8 L45 28 C45 38 35 46 25 50 C15 46 5 38 5 28 L5 8 Z" fill="url(#shieldGrad)" />
        <rect x="14" y="14" width="22" height="3" rx="1.5" fill="white" opacity="0.9"/>
        <rect x="14" y="21" width="18" height="3" rx="1.5" fill="white" opacity="0.7"/>
        <rect x="14" y="28" width="14" height="3" rx="1.5" fill="white" opacity="0.5"/>
        <path d="M30 33 L35 38 L43 28" stroke="#10B981" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="55" y="33" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Catalog</text>
        <text x="137" y="33" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="#14b8a6">Guard</text>
      </svg>
    </div>

    <h1>Data Deletion Request</h1>
    
    <p>CatalogGuard respects your privacy and your right to control your data. You can request deletion of your data at any time.</p>

    <h2>What Data We Store</h2>
    <p>When you use CatalogGuard, we store:</p>
    <ul>
      <li>Your email address (for account purposes)</li>
      <li>OAuth access tokens for Shopify and Meta (to connect your accounts)</li>
      <li>Aggregated performance metrics (ad spend, ROAS calculations)</li>
    </ul>
    <p>We do NOT store your personal Facebook profile data, posts, photos, or friends list.</p>

    <h2>How to Request Data Deletion</h2>
    
    <div class="card">
      <p><strong>To request deletion of all your data, please email:</strong></p>
      <p style="font-size: 20px; margin: 16px 0;">
        <a href="mailto:privacy@catalogguard.com?subject=Data%20Deletion%20Request" class="email-link">privacy@catalogguard.com</a>
      </p>
      <p>Include in your email:</p>
      <ul>
        <li>Subject line: "Data Deletion Request"</li>
        <li>The email address associated with your CatalogGuard account</li>
        <li>Your Shopify store URL (if applicable)</li>
      </ul>
    </div>

    <h2>What Happens Next</h2>
    <p>Upon receiving your request, we will:</p>
    <ul>
      <li>Verify your identity</li>
      <li>Delete all personal data associated with your account within 30 days</li>
      <li>Revoke any stored access tokens</li>
      <li>Send you confirmation once deletion is complete</li>
    </ul>

    <h2>Revoking Access Directly</h2>
    <p>You can also revoke CatalogGuard's access directly:</p>
    <ul>
      <li><strong>Meta:</strong> Go to Facebook Settings → Security and Login → Apps and Websites → Remove CatalogGuard</li>
      <li><strong>Shopify:</strong> Go to your Shopify Admin → Settings → Apps → Remove CatalogGuard</li>
    </ul>

    <div class="footer">
      <p>CatalogGuard is operated by Go Above The Line Limited, New Zealand.</p>
      <p style="margin-top: 8px;">
        <a href="/privacy" class="email-link">Privacy Policy</a> · 
        <a href="/terms" class="email-link">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}
```

5. Click **Commit changes**
6. Vercel auto-deploys
7. URL will be: `https://catalogguard.com/api/data-deletion`

Then in Meta App settings, enter:
```
https://catalogguard.com/api/data-deletion
