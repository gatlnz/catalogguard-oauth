export default async function handler(req, res) {
  const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
  const metaAppId = process.env.META_APP_ID;
  const metaRedirectUri = process.env.META_REDIRECT_URI;
  
  const shopifyAuthUrl = "https://shopify.com/admin/oauth/authorize?client_id=" + shopifyClientId + "&scope=read_products,write_products,read_inventory,read_orders&redirect_uri=https://catalogguard-oauth.vercel.app/api/shopify/callback";
  
  const metaAuthUrl = "https://www.facebook.com/v18.0/dialog/oauth?client_id=" + metaAppId + "&redirect_uri=" + encodeURIComponent(metaRedirectUri) + "&scope=ads_read,ads_management,business_management";

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CatalogGuard - Connect Your Accounts</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
      color: #e2e8f0;
      padding: 40px 20px;
    }
    .container { max-width: 500px; margin: 0 auto; }
    .logo { margin-bottom: 8px; }
    .logo img { height: 48px; width: auto; }
    .subtitle { color: #64748b; margin-bottom: 40px; font-size: 16px; }
    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 16px;
    }
    .card:hover { border-color: rgba(20, 184, 166, 0.3); }
    .step-header { display: flex; align-items: center; margin-bottom: 16px; }
    .step-number {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      margin-right: 12px;
    }
    .step-title { font-size: 18px; font-weight: 600; color: white; }
    .status {
      margin-left: auto;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }
    .step-desc {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.6;
      padding-left: 44px;
    }
    .btn-wrap { padding-left: 44px; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
      color: white;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-shopify { background: linear-gradient(135deg, #95bf47 0%, #7ab83a 100%); }
    .btn-meta { background: linear-gradient(135deg, #1877f2 0%, #0d65d9 100%); }
    .help-box {
      background: rgba(20, 184, 166, 0.1);
      border: 1px solid rgba(20, 184, 166, 0.2);
      padding: 20px 24px;
      margin-top: 24px;
      border-radius: 12px;
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .help-box strong { color: #14b8a6; display: block; margin-bottom: 8px; }
    .powered-by { text-align: center; margin-top: 40px; color: #475569; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://raw.githubusercontent.com/gatlnz/catalogguard-oauth/main/catalogguard-logo.svg" alt="CatalogGuard">
    </div>
    <p class="subtitle">Connect your accounts to start protecting your ad spend</p>
    
    <div class="card">
      <div class="step-header">
        <span class="step-number">1</span>
        <span class="step-title">Connect Shopify</span>
        <span class="status">Not connected</span>
      </div>
      <p class="step-desc">We'll access your product catalog and inventory data to monitor stock levels and identify out-of-stock items.</p>
      <div class="btn-wrap">
        <a href="${shopifyAuthUrl}" class="btn btn-shopify">Connect Shopify Store</a>
      </div>
    </div>
    
    <div class="card">
      <div class="step-header">
        <span class="step-number">2</span>
        <span class="step-title">Connect Meta Ads</span>
        <span class="status">Not connected</span>
      </div>
      <p class="step-desc">We'll access your ad performance data to calculate ROAS and identify underperforming products in your catalog.</p>
      <div class="btn-wrap">
        <a href="${metaAuthUrl}" class="btn btn-meta">Connect Meta Ads</a>
      </div>
    </div>
    
    <div class="help-box">
      <strong>What happens next?</strong>
      After connecting both accounts, you'll receive access tokens. Copy these into your CatalogGuard dashboard to start monitoring your catalog ads—optimizing spend on top performers and protecting your budget from out-of-stock products.
    </div>
    
    <p class="powered-by">CatalogGuard - Smarter catalog ad spend</p>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}
