export default async function handler(req, res) {
  const shopifyAuthUrl = `https://shopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=read_products,write_products,read_inventory,read_orders&redirect_uri=https://catalogguard-oauth.vercel.app/api/shopify/callback`;
  
  const metaAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI)}&scope=ads_read,ads_management,business_management`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CatalogGuard - Connect Your Accounts</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          color: #e2e8f0;
          padding: 40px 20px;
        }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { 
          font-size: 32px; 
          font-weight: bold; 
          color: #2dd4bf; 
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #2dd4bf;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 20px;
        }
        .subtitle { color: #94a3b8; margin-bottom: 40px; }
        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
        }
        .step-number {
          background: #2dd4bf;
          color: #0f172a;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          margin-right: 10px;
        }
        .step-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .step-desc {
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 14px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .btn-shopify {
          background: #96bf48;
          color: #fff;
        }
        .btn-meta {
          background: #1877f2;
          color: #fff;
        }
        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          margin-left: auto;
        }
        .status-pending {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }
        .status-connected {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        .help-text {
          background: rgba(45, 212, 191, 0.1);
          border-left: 3px solid #2dd4bf;
          padding: 15px;
          margin-top: 30px;
          border-radius: 0 8px 8px 0;
          font-size: 14px;
          color: #94a3b8;
        }
        .help-text a {
          color: #2dd4bf;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-icon">⚡</div>
          CatalogGuard
        </div>
        <p class="subtitle">Connect your accounts to get started</p>
        
        <div class="card">
          <div class="step-title">
            <span class="step-number">1</span>
            Connect Shopify
            <span class="status status-pending">Not connected</span>
          </div>
          <p class="step-desc">
            We'll access your product catalog and inventory data to monitor stock levels.
          </p>
          <a href="${shopifyAuthUrl}" class="btn btn-shopify">Connect Shopify Store</a>
        </div>
        
        <div class="card">
          <div class="step-title">
            <span class="step-number">2</span>
            Connect Meta Ads
            <span class="status status-pending">Not connected</span>
          </div>
          <p class="step-desc">
            We'll access your ad performance data to calculate ROAS and identify underperformers.
          </p>
          <a href="${metaAuthUrl}" class="btn btn-meta">Connect Meta Ads</a>
        </div>
        
        <div class="help-text">
          <strong>What happens next?</strong><br>
          After connecting both accounts, you'll receive access tokens. Copy these into your CatalogGuard dashboard to start monitoring your catalog ads.
        </div>
      </div>
    </body>
    </html>
  `);
}
