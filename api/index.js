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
          margin-bottom: 8px;
        }
        .logo img {
          height: 48px;
          width: auto;
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
