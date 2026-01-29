import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify HMAC signature
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  if (!hmacHeader) {
    return res.status(401).json({ error: 'Missing HMAC signature' });
  }

  const body = JSON.stringify(req.body);
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmacHeader) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  // Log the request for compliance records
  console.log('Shop redact request received:', {
    shop: req.headers['x-shopify-shop-domain'],
    shop_id: req.body?.shop_id,
    timestamp: new Date().toISOString()
  });

  // CatalogGuard doesn't store shop data server-side (all data is in user's Google Sheet)
  // In a real scenario, you'd delete all stored data for this shop
  return res.status(200).json({ 
    message: 'Shop redact request acknowledged. CatalogGuard does not store shop data server-side.' 
  });
}
