// api/webhooks/lemonsqueezy.js
// Receives Lemon Squeezy purchase webhooks and sends to Meta CAPI

const crypto = require('crypto');

const PIXEL_ID = '891886096645666';
const ACCESS_TOKEN = 'EAARXterISSABOl4F6GCCj8ZCJRFPFAP6XOSNUul34XK1PRkkNFmLkmOC6mDZAgpjIJ0BL52DJ7ZBZBKfOpFZAzZBtN6DXkZC55kyJxZB7zRNgRMWyjflZBiECYZCqhUQtxijiBEuhqaGtb7aqxkWws9Ii1HN0pQF1nF6swAUiQ2S2ADy15tLYrdWau3YxfQ0nJqNhoggZDZD';
const WEBHOOK_SECRET = 'cg_webhook_2026_xK9mPqR7vL3nJ8wF';

// Verify Lemon Squeezy webhook signature
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Hash function for user data (Meta requires SHA256 hashing)
function hashData(data) {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature
    const signature = req.headers['x-signature'];
    if (!signature) {
      console.error('Missing webhook signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const rawBody = JSON.stringify(req.body);
    if (!verifySignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    
    // Check if this is an order_created event
    if (event.meta?.event_name !== 'order_created') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    const order = event.data?.attributes;
    if (!order) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Extract purchase data
    const email = order.user_email;
    const firstName = order.user_name?.split(' ')[0] || '';
    const lastName = order.user_name?.split(' ').slice(1).join(' ') || '';
    const value = parseFloat(order.total) / 100; // Lemon Squeezy sends cents
    const currency = order.currency?.toUpperCase() || 'USD';
    const orderId = order.order_number?.toString() || event.data?.id;

    // Build Meta CAPI payload
    const eventData = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `ls_${orderId}`, // For deduplication with browser pixel
      event_source_url: 'https://www.catalogguard.com',
      action_source: 'website',
      user_data: {
        em: email ? [hashData(email)] : undefined,
        fn: firstName ? [hashData(firstName)] : undefined,
        ln: lastName ? [hashData(lastName)] : undefined,
        client_user_agent: req.headers['user-agent'] || '',
      },
      custom_data: {
        currency: currency,
        value: value,
        content_name: 'CatalogGuard',
        content_type: 'product',
        order_id: orderId,
      },
    };

    // Remove undefined fields from user_data
    Object.keys(eventData.user_data).forEach(key => {
      if (eventData.user_data[key] === undefined) {
        delete eventData.user_data[key];
      }
    });

    // Send to Meta Conversions API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
        }),
      }
    );

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta CAPI error:', metaResult);
      return res.status(500).json({ error: 'Failed to send to Meta', details: metaResult });
    }

    console.log('Purchase event sent to Meta CAPI:', {
      order_id: orderId,
      value: value,
      currency: currency,
      meta_response: metaResult,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Purchase event sent to Meta CAPI',
      events_received: metaResult.events_received,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
