export default function handler(req, res) {
  const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = 'https://catalogguard-oauth.vercel.app/api/shopify/callback';
  
  // Get shop from query parameter
  const shop = req.query.shop;
  
  // If no shop provided, show input form
  if (!shop) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Connect Shopify - CatalogGuard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(45, 212, 191, 0.2);
            border-radius: 16px;
            padding: 40px;
          }
          h1 {
            color: #2dd4bf;
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            color: #94a3b8;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          label {
            display: block;
            color: #cbd5e1;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .input-group {
            display: flex;
            gap: 0;
            margin-bottom: 20px;
          }
          input {
            flex: 1;
            padding: 14px 16px;
            background: #1e293b;
            border: 1px solid rgba(45, 212, 191, 0.3);
            border-right: none;
            border-radius: 8px 0 0 8px;
            color: #e2e8f0;
            font-size: 16px;
            font-family: 'DM Sans', sans-serif;
          }
          input:focus {
            outline: none;
            border-color: #2dd4bf;
          }
          .suffix {
            padding: 14px 16px;
            background: #1e293b;
            border: 1px solid rgba(45, 212, 191, 0.3);
            border-left: none;
            border-radius: 0 8px 8px 0;
            color: #64748b;
            font-size: 16px;
          }
          button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            transition: transform 0.2s;
          }
          button:hover {
            transform: translateY(-2px);
          }
          .example {
            margin-top: 15px;
            padding: 12px;
            background: rgba(251, 191, 36, 0.1);
            border-left: 3px solid #fbbf24;
            border-radius: 6px;
            font-size: 14px;
            color: #fbbf24;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🛍️ Connect Shopify</h1>
          <p>Enter your Shopify store name to connect</p>
          
          <form method="GET" action="/api/shopify">
            <label>Your Store Name:</label>
            <div class="input-group">
              <input 
                type="text" 
                name="shop" 
                placeholder="yourstore" 
                required
                pattern="[a-zA-Z0-9-]+"
                title="Store name only (no special characters)"
              />
              <span class="suffix">.myshopify.com</span>
            </div>
            
            <button type="submit">Continue to Shopify →</button>
          </form>
          
          <div class="example">
            <strong>Example:</strong> If your store is <code>boxhill.myshopify.com</code>, just enter <strong>boxhill</strong>
          </div>
        </div>
      </body>
      </html>
    `);
  }
  
  // Clean up shop name
  let cleanShop = shop.toLowerCase().trim();
  
  // Remove .myshopify.com if user included it
  cleanShop = cleanShop.replace('.myshopify.com', '');
  
  // Remove https:// or http:// if user included it
  cleanShop = cleanShop.replace(/^https?:\/\//, '');
  
  // Add .myshopify.com
  const fullShop = `${cleanShop}.myshopify.com`;
  
  const shopifyAuthUrl = `https://${fullShop}/admin/oauth/authorize?` +
    `client_id=${shopifyClientId}&` +
    `scope=read_products,write_products,read_inventory,read_orders&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  // Redirect to Shopify OAuth
  res.redirect(302, shopifyAuthUrl);
}
