// Vercel Serverless Function — System Health & Supabase Bridge Status

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgxkcfvfwznyflnjflcp.supabase.co';

  res.status(200).json({
    status: 'online',
    system: 'BridgeSTU AI-Powered Academic & Well-Being Platform',
    environment: process.env.VERCEL_ENV || 'production',
    supabaseUrl: supabaseUrl,
    supabaseConfigured: true,
    timestamp: new Date().toISOString()
  });
};
