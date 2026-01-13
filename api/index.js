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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          color: #e2e8f0;
          padding: 40px 20px;
        }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { 
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }
        .logo-icon svg {
          width: 28px;
          height: 28px;
          color: white;
        }
        .logo-icon::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #f59e0b;
          border-radius: 50%;
          border: 2px solid #0f172a;
        }
        .logo-text {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }
        .logo-text span {
          color: #14b8a6;
        }
        .subtitle { 
          color: #64748b; 
          margin-bottom: 40px;
          font-size: 16px;
        }
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .card:hover {
          border-color: rgba(20, 184, 166, 0.3);
        }
        .step-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
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
          box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
        }
        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
        }
        .status {
          margin-left: auto;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-pending {
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
        .btn-wrap {
          padding-left: 44px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .btn-shopify {
          background: linear-gradient(135deg, #95bf47 0%, #7ab83a 100%);
          color: #fff;
        }
        .btn-shopify:hover {
          box-shadow: 0 4px 16px rgba(149, 191, 71, 0.4);
        }
        .btn-meta {
          background: linear-gradient(135deg, #1877f2 0%, #0d65d9 100%);
          color: #fff;
        }
        .btn-meta:hover {
          box-shadow: 0 4px 16px rgba(24, 119, 242, 0.4);
        }
        .btn svg {
          width: 18px;
          height: 18px;
        }
        .help-box {
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          padding: 20px 24px;
          margin-top: 24px;
          border-radius: 12px;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
        }
        .help-box strong {
          color: #14b8a6;
          display: block;
          margin-bottom: 8px;
          font-size: 15px;
        }
        .powered-by {
          text-align: center;
          margin-top: 40px;
          color: #475569;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-2.52.91L3.16 8.91a2 2 0 0 0 .91 2.52l12.35 6.61a1.93 1.93 0 0 0 2.52-.91l2.88-5.77a2 2 0 0 0-.91-2.52z"/>
              <path d="m11 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="logo-text">Catalog<span>Guard</span></div>
        </div>
        <p class="subtitle">Connect your accounts to start protecting your ad spend</p>
        
        <div class="card">
          <div class="step-header">
            <span class="step-number">1</span>
            <span class="step-title">Connect Shopify</span>
            <span class="status status-pending">Not connected</span>
          </div>
          <p class="step-desc">
            We'll access your product catalog and inventory data to monitor stock levels and identify out-of-stock items.
          </p>
          <div class="btn-wrap">
            <a href="${shopifyAuthUrl}" class="btn btn-shopify">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.337 3.415c-.143-.07-.306-.07-.45 0L8.43 6.622a.867.867 0 0 0-.45.761v7.234c0 .314.17.602.45.761l6.457 3.207c.143.07.306.07.45 0l6.457-3.207a.867.867 0 0 0 .45-.761V7.383a.867.867 0 0 0-.45-.761l-6.457-3.207z"/></svg>
              Connect Shopify Store
            </a>
          </div>
        </div>
        
        <div class="card">
          <div class="step-header">
            <span class="step-number">2</span>
            <span class="step-title">Connect Meta Ads</span>
            <span class="status status-pending">Not connected</span>
          </div>
          <p class="step-desc">
            We'll access your ad performance data to calculate ROAS and identify underperforming products in your catalog.
          </p>
          <div class="btn-wrap">
            <a href="${metaAuthUrl}" class="btn btn-meta">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
              Connect Meta Ads
            </a>
          </div>
        </div>
        
        <div class="help-box">
          <strong>💡 What happens next?</strong>
          After connecting both accounts, you'll receive access tokens. Copy these into your CatalogGuard dashboard to start monitoring your catalog ads and protecting your ad spend from out-of-stock products.
        </div>
        
        <p class="powered-by">Powered by CatalogGuard • Stop wasting ad spend on dead stock</p>
      </div>
    </body>
    </html>
  `);
}
