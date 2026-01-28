export default function handler(req, res) {
  const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = 'https://catalogguard-oauth.vercel.app/api/shopify/callback';
  
  // Shopify requires shop parameter
  const shop = req.query.shop || 'myshopify.com';
  
  const shopifyAuthUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${shopifyClientId}&` +
    `scope=read_products,write_products,read_inventory,read_orders&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  // Redirect to Shopify OAuth
  res.redirect(302, shopifyAuthUrl);
}
