export default function handler(req, res) {
  const metaAppId = process.env.META_APP_ID;
  const metaRedirectUri = process.env.META_REDIRECT_URI || 'https://catalogguard-oauth.vercel.app/api/meta/callback';
  
  const metaAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${metaAppId}&` +
    `redirect_uri=${encodeURIComponent(metaRedirectUri)}&` +
    `scope=ads_read,ads_management,business_management`;
  
  // Redirect to Meta OAuth
  res.redirect(302, metaAuthUrl);
}
