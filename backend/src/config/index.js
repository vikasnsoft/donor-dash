/**
 * Central configuration module.
 * All environment variables accessed through this single module.
 * Never use process.env directly elsewhere.
 */

const config = {
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  server: {
    port: parseInt(process.env.PORT || '5001', 10),
    host: process.env.HOST || '0.0.0.0',
  },

  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/donor-dash',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    cookieExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
    cookieName: 'jwt',
  },

  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'https://yourdomain.com'
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000', 10), // 10 min
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    enabled: !!process.env.REDIS_URL,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || null,
    enabled: !!process.env.SENTRY_DSN,
  },

  storage: {
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseKey: process.env.SUPABASE_ANON_KEY || null,
    enabled: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  },

  ocr: {
    googleVisionApiKey: process.env.GOOGLE_CLOUD_VISION_API_KEY || null,
    enabled: !!process.env.GOOGLE_CLOUD_VISION_API_KEY,
  },

  plaid: {
    clientId: process.env.PLAID_CLIENT_ID || null,
    secret: process.env.PLAID_SECRET || null,
    env: process.env.PLAID_ENV || 'sandbox',
    enabled: !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET),
  },

  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@donordash.com',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};

/**
 * Validate required config in production.
 */
if (config.isProd) {
  const required = [
    { key: 'JWT_SECRET', value: config.jwt.secret },
    { key: 'MONGO_URI', value: config.mongo.uri },
  ];

  for (const { key, value } of required) {
    if (!value || value === 'dev-secret-change-in-production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export default config;
